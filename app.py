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

description = {}

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

    if target_seconds > 0:
        percent = (int(seconds)/ int(target_seconds)) * 100
        percent = round(percent, 2)
    else:
        percent = 0

    description["hours"] = hours
    description["percent"] = percent
    description['target_hours'] = target_hours

    return jsonify({"connected": True, "hours": round(seconds/3600, 2), "target_hours": f"{target_seconds / 3600}", "percent": percent}) 

@app.route('/hackatime/streaks')
def get_streaks():
        token = session.get("hackatime_token")

        if not token:
            return jsonify({"ok": False, "message": "No hackatime_token found just update the run."})

        streak = requests.get(
            "https://hackatime.hackclub.com/api/v1/authenticated/streak",
            headers={
                "Authorization": f"Bearer {token}"
            }
        )

        data = streak.json()
        streak = data.get("streak_days", 0)

        description["streak"] = streak

        return jsonify({"ok": True, "streak": streak})        


@app.route('/feedback/line')
def give_message():
    hours = description.get("hours", 0)
    target_hours= description.get("target_hours", 0)
    percent_done = description.get("percent", 0)
    streak = description.get("streak", 0)

    message = ""

    if hours >= target_hours:
        message += "You are on top of your target. Awesome job!"
        if streak >=3:
            message += " You have moved your streak one day further! 🎉"
    elif percent_done >= 80:
        message += "Almost there, dont let intrusive thoughts take over."
        if streak >=3:
            message += f" You are so close, don't lose your streak of {streak} days"

    elif percent_done >= 50:
        message += "You are halfway done. Suck it up and keep moving..."
        if streak >=3:
            message += " Don't lose your streak by not trying."

    else:
        message += "Lock in. Start doin' your coding for today."
        if streak >=3:
            message += " Your streak is at a critical position, try to save it up by coding."

    return jsonify({"ok": True, "message": message})

if __name__ == "__main__":
    app.run(debug=True)
