from flask import Flask, jsonify, request, session, redirect
from datetime import datetime
import requests
import os

app = Flask(__name__)


def hackatime_callback():
    code = request.args.get("code")

    redirect_uri = "http://localhost:5000/apo/hackatime/callback"
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

    return 


@app.route("/hackatime/hours")
def hackatime_hours():
    hackatime_callback()
    token = session.get["hackatime_token"]

    if not token:
        return jsonify({"connected": False, "hours": 0})

    today = datetime.date.today().isoformat()

    response = requests.get(
        "https://hackatime.hackclub.com/api/v1/authenticated-hours",
        headers={
            "Authorization": f"Beares {token}"
        },
        params={
            "start_date": today,
            "end_date": today
        }
    )

    data = response.json()
    seconds = data.get("total_second", 0)

    return jsonify({"connected": True, "hours": round(seconds/ 3600, 2)})
