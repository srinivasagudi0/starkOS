from flask import Flask, jsonify, request, session, redirect
from datetime import datetime
import requests
import os

app = Flask(__name__)

app.secret_key = os.getenv("FLASK_SECRET_KEY")

backend_url = "http://localhost:5000"


def get_access_token(code):
    redirect_uri = f"{backend_url}/api/hackatime/callback"

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
    return data.get("access_token")

@app.route('/api/hackatime/connect')
def connect_hackatime():
    return redirect(
        "https://hackatime.hackclub.com/oauth/authorize"
        f"?client_id={os.getenv('HACKATIME_ID')}"
        f"&redirect_uri={backend_url}/api/hackatime/callback"
        "&response_type=code"
        "&scope=read"
    )

@app.route("/api/hackatime/callback")
def hackatime_callback():
    code = request.args.get("code")

    if not code:
        return jsonify({"message": "Authorization code is missing."}), 400

    token = get_access_token(code)

    if not token:
        return jsonify({"message": "Hackatime couldn't connect."}), 400

    session["hackatime_token"] = token

    return jsonify({"message": "Hackatime connected successfully."})


@app.route("/command-center/coded-hours")
def coding_hours():
    access_token = session.get("hackatime_token")

    if not access_token:
        return jsonify({"message": "Hackatime is not connected."}), 401

    today = datetime.now().date().isoformat()

    query = {
        "start_date": today,
        "end_date": today
    }

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(
        "https://hackatime.hackclub.com/api/v1/authenticated/hours",
        params=query,
        headers=headers
    )

    data = response.json()

    return jsonify(data)