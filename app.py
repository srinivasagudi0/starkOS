from flask import Flask, jsonify, request, session, redirect
from datetime import datetime
import requests
from flask_cors import CORS
import os

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
CORS(
    app,
    origins=["http://localhost:5173"],
    supports_credentials=True
)

@app.route("/api/hackatime/connect")
def connect_hackatime():
    return redirect(
        "https://hackatime.hackclub.com/oauth/authorize"
        f"?client_id={os.getenv('HACKATIME_ID')}"
        "&redirect_uri=http://localhost:5000/api/hackatime/callback"
        "&response_type=code"
        "&scope=profile+read"
    )

@app.route("/api/hackatime/callback")
def hackatime_callback():
    code = request.args.get("code")

    redirect_uri = "http://localhost:5000/api/hackatime/callback"
    response = requests.post(
        "https://hackatime.hackclub.com/oauth/token",

        data={
            "client_id": os.getenv("HACKATIME_ID"),
            "client_secret": os.getenv("HACKATIME_SECRET"),
            "code": code,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code"
        }
    )

    data = response.json()
    token = data.get("access_token")

    if not token:
        return jsonify({"message": "Hacaktime couldn't connect. Check connection settings"})

    session["hackatime_token"] = token

    return jsonify({"message": "Hackatime connected sucesfully."})

def get_hackatime_api():
    access_token = session.get("hackatime_token")
    key_response = requests.get(
        "https://hackatime.hackclub.com/api/v1/authenticated/api_keys",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    api_key = key_response.json().get("token")
    session["api_key"] = api_key
    return api_key


@app.route("/hackatime/hours")
def hackatime_hours():

    token = session.get("hackatime_token")

    if not token:
        return jsonify({"connected": False, "hours": 0})

    today = datetime.now().date().isoformat()

    hours = requests.get(
        "https://hackatime.hackclub.com/api/v1/authenticated/hours",
        headers={
            "Authorization": f"Bearer {token}"
        },
        params={
            "start_date": today,
            "end_date": today
        }
    )
    get_hackatime_api()

    api_key = session.get("api_key")

    target_hours = requests.get(
        "https://hackatime.hackclub.com/api/hackatime/v1/users/current/statusbar/today",
        params={"api_key": api_key}
    )

    data = target_hours.json()
    target_seconds = data.get("data", {}).get("goal", {}).get("target_seconds", 0)
    

    data = hours.json()
    seconds = data.get("total_seconds", 0)

    percent = (int(seconds)/ int(target_seconds)) * 100
    percent = round(percent, 2)

    return jsonify({"connected": True, "hours": round(seconds/3600, 2), "target_hours": f"{target_seconds / 3600}", "percent": percent}) 

if __name__ == "__main__":
    app.run(debug=True)
