# starkOS

# StarkOS

StarkOS is my personal coding command center.

I made it to see my coding activity, start focus sessions, check the weather, and look at my projects without opening five different websites.

## What it can do

- Show today's Hackatime coding hours
- Show my coding streak
- Start 25, 50, or 90 minute focus sessions
- Save focus timer progress in local storage
- Send a browser notification when focus ends
- Check weather by city or ZIP code
- Show coding activity for the last seven days
- Show project and language breakdowns
- Create a story about a project and its GitHub commits
- Quiz me about the languages I used
- Use a small terminal on the Command Center
- Run commands like `help`, `status`, `weather`, and `focus 25`
- Give weekly coding information

## How Hackatime works

StarkOS connects to Hackatime through OAuth. After connecting, Flask stores the access token in the session and uses it to request coding activity.

## My favorite part

The Command Center is the main page. It has the focus timer, coding information, streak, weather, and a terminal that can control some of the features.

I wanted StarkOS to feel like a personal system that I built for myself instead of another ordinary to-do list.

## Project status

The main features are working. I am currently doing final styling, deployment, and bug fixes.