from flask import Flask, jsonify, request, session, redirect
from datetime import datetime, timedelta
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

    if target_seconds > 0:
        percent = (int(seconds)/ int(target_seconds)) * 100
        percent = round(percent, 2)
    else:
        percent = 0


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



        return jsonify({"ok": True, "streak": streak})        


@app.route('/feedback/line')
def give_message():
    messages = [
        "Keep cooking!",
        "Don't give up!",
        "Everything is here.",
        "Made by Srinivasa Gudi.",
        "Keep up with your streak.",
        "Go touch some grass.",
        "Go code a feature."
    ] #chosen randomly

    import random

    meassage = random.choice(messages)
    return jsonify({"ok": True, "message": meassage})

@app.route("/hackatime/past7days")
def get_last_days():
    token = session["hackatime_token"]

    if not token:
        return jsonify({"connected": False, "hours": 0}), 401

    today = datetime.now().date()
    hours_data = {}

    for i in range(6, -1, -1):
        current_date = today - timedelta(days=i)
        date_string = current_date.isoformat()

        hours = requests.get(
            "https://hackatime.hackclub.com/api/v1/authenticated/hours",
            headers={
                "Authorization": f"Bearer {token}"
            },
            params={
                "start_date": date_string,
                "end_date": date_string
            }
        )
        
        data = hours.json()
        seconds = data.get("total_seconds", 0)

        hours_data[date_string] = round(seconds/3600, 2)

    return jsonify(hours_data)

@app.route("/hackatime/week-details")
def get():
    token = session.get("hackatime_token")

    if not token:
        return jsonify({"message": "Hackatime is not connected."}), 401

    # week overview
    hours_data = get_last_days().get_json()
    total_hours = 0
    for hours in hours_data.values():
        total_hours += hours

    active_days = []

    for day, hours in hours_data.items():
        if hours > 0:
            active_days.append(day)

    average = total_hours / 7

    # daily breakdown

    date = datetime.now().date().isoformat()

    today_hours = hours_data.get(date, 0)

    get_hackatime_api()

    api_key = session.get("api_key")

    data = requests.get(
    "https://hackatime.hackclub.com/api/hackatime/v1/users/current/stats/last_7_days",
    headers={
        "Authorization": f"Bearer {api_key}"
    }
    )

    print("Stats status:", data.status_code)
    print("Stats response:", data.text)
    data = data.json().get("data", {})

    projects = data.get("projects", [])
    langs = data.get("languages", [])

    top_project = max(
        projects, 
        key=lambda project: project["total_seconds"], 
        default=None).get("name") # most worked project

    top_langs = max(
        langs,
        key=lambda language: language["total_seconds"],
        default=None).get("name")

    busiest_day = max(hours_data, key=hours_data.get, default=None) # show the world how busy you are.

    return jsonify({
        "total_hours": round(total_hours, 2),
        "active_days": len(active_days),
        "average_hours": round(average, 2),
        "daily_hours": hours_data,
        "busiest_day": busiest_day,
        "top_project": top_project,
        "top_language": top_langs
    })   #returns lot of info


if __name__ == "__main__":
    app.run(debug=True)
