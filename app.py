from flask import Flask, jsonify, request
from datetime import datetime
import requests
import os

app = Flask(__name__)


# during deployment need to check if this is in render and then give it a different frontrdn and backend 
backend_url = "http://localhost:5000"


def hackatime_callback():
    code = request.args.get("code")
    redirect_uri = f"{backend_url}/api/hackatime/callback"
    response = requests.post(
        "https://hackatime.hackclub.com/oauth/token",
        data={
            "client_id": os.getenv("HACKATIME_CLIENT_ID"),
            "client_secret": os.getenv("HACKATIME_CLIENT_SECRET"),
            "code": code,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code"
        },
    )

    data = response.json()
    token = data.get("access_token")

    if not token: return "Sorry, something went wrong."

    return token




@app.route("/command-center/coded-hours")
def coding_hours():
    # get hackatime credentials, get today-date, fetch today hours from hackatime, fetch target hours, return today's date and hours today, percent close to target being done.
    id = os.getenv("HACKATIME_ID")
    secret = os.getenv("HACKATIME_SECRET")
    today = datetime.date.today()

    acess_token = None

    query = {
        "start_date": today,
        "end_date": today,
    }

    access_token = hackatime_callback()

    headers = {
        "Authorization": {acess_token}
    }

    pass

