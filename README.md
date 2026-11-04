# StarkOS

StarkOS is my personal coding command center.

I made this because I wanted one place where I could check my coding hours, start focus sessions, check the weather, and see my projects instead of opening like five different websites every time.

## What it can do

- Shows today's Hackatime coding hours
- Shows my coding streak
- Has 25, 50, and 90 minute focus timers
- Saves the timer progress even if I refresh the page
- Sends a notification when the timer ends
- Checks weather using a city or ZIP code
- Shows my coding activity from the last 7 days
- Shows which projects and languages I worked on
- Makes a story about a project using its GitHub commits
- Has a quiz about the coding languages I used
- Has a small terminal inside the Command Center
- Can run commands like `help`, `status`, `weather`, and `focus 25`
- Shows weekly coding stats

## Why it took 50 hours

This project took me around 50 hours because there was actually a lot more stuff to do than I originally thought.

I had to work on React pages, Flask backend, Hackatime OAuth, APIs, focus timers, weather, GitHub commits, weekly reports, quizzes, and the terminal.

I also spent a lot of time fixing bugs. Sometimes one feature would work but then something else would stop working. I had problems with authentication, API responses, connecting the frontend and backend, and especially deployment.

I tried different ways to fix these problems, tested them, found more bugs, and kept changing things until they worked.

The CSS also took quite a bit of time because I wanted the dashboard to actually look good and not like some basic website. I worked on the layout, animations, responsiveness, and small UI details.

So yeah, most of the time wasn't just writing code. It was testing, debugging, changing things, and making sure everything worked together.

## How Hackatime works

StarkOS connects to Hackatime using OAuth. Once I log in, the Flask backend stores the access token in the session and uses it to get my coding activity.

This was also one of the things I had to spend time understanding and debugging.

## My favorite part

My favorite part is probably the Command Center itself.

It has almost everything I wanted in one place. The focus timer, coding hours, streak, weather, and even a small terminal that can control some features.

I wanted to make something that I would actually use while coding, not just another random to-do list website.

## AI Usage

I tried to do as much as possible myself, but I did use AI when I got stuck on some parts.

I mainly used ChatGPT and Codex for debugging, understanding Flask and React, Hackatime OAuth and APIs, and fixing problems with connecting my Flask backend on Render to my frontend on Vercel.

I also got some AI help with the loading screen CSS, cloud setup, the language quiz submission function, and writing and improving some of the OpenAI prompts for the project story and weekly summaries.

Some parts were confusing, especially OAuth, API responses, and deployment, so I used AI to understand what was going wrong and get code suggestions or fixes.

I worked on the project features, UI, integrations, and testing myself, with AI helping on certain parts.

Codex recorded around 53 minutes out of 49 hours of tracked coding, which is about 1.8%. This only counts recorded Codex time, not all the times I asked ChatGPT for help.


## Project Status

Most of the main features are working now, and I'm pretty happy with how it turned out.

I might come back and add more cool pages and features later, especially if this project gets approved. I still have a few ideas I want to try, but for now I think StarkOS is done.
