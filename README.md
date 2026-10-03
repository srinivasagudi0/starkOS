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

## Justification of time

It took me 50 hrs because I tried to accomplished all the below:

- React pages and routing
- Flask backend routes
- Hackatime OAuth login and coding statistics
- Focus timer with localStorage
- Browser notifications
- Weather API integration
- Project and language breakdowns
- GitHub commit and project analysis
- Weekly reports and quiz logic
- A working terminal connected to the focus timer
- Loading, error, and empty states
- Custom CSS layout, animations, and responsive fixes
- Debugging authentication, API responses, deployment, and hosting

Also a lot of time went into fixing problems. The polish on the UI looks good too. 


## How Hackatime works

StarkOS connects to Hackatime through OAuth. After connecting, Flask stores the access token in the session and uses it to request coding activity.

## My favorite part

The Command Center is the main page. It has the focus timer, coding information, streak, weather, and a terminal that can control some of the features.

I wanted StarkOS to feel like a personal system that I built for myself instead of another ordinary to-do list.


## AI Usage

Honestly I used AI as little as possible from the start. I needed to use AI help me connect links between two hosting platforms(render(flask backend and vercal frontend). I also used it  for debugging, explaining Flask and React, Hackatime APIs, OAuth, CSS, deployment, and small code suggestions. I wrote, tested, designed, and connected the main project myself. Codex recorded about 53 minutes out of 49 hours of coding, which is under 2% of tracked coding time.

## Project status

The main features are working. I think I will come back add more cool new page(and stuff) if this project gets approved.
