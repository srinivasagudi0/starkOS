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

## Tech used

- React
- Vite
- Python
- Flask
- Hackatime API
- GitHub API
- Open-Meteo weather API
- OpenAI API for some project summaries
- CSS

## Run it locally

### Backend

From the main project folder:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

The hosted Flask backend used by the frontend is:

```text
https://starkos-backend.onrender.com
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The React frontend runs on:

```text
http://localhost:5173
```

## Environment variables

The backend needs these values:

```text
FLASK_SECRET_KEY=your-secret-key
HACKATIME_ID=your-hackatime-client-id
HACKATIME_SECRET=your-hackatime-client-secret
OPENAI_API_KEY=your-openai-key
```

Do not put these values directly into the code or commit them to GitHub.

## Hosting

- Vercel: use `frontend` as the root directory, `npm run build` as the build command, and `dist` as the output directory. `frontend/vercel.json` sends React page refreshes to `index.html`.
- Render: use the repository root, `pip install -r requirements.txt` as the build command, and `gunicorn app:app --bind 0.0.0.0:$PORT` as the start command.
- Set the private backend environment variables listed above on Render.
- Set `FRONTEND_URL=https://stark-os1-gamma.vercel.app`, `HACKATIME_CALLBACK_URL=https://starkos-backend.onrender.com/api/hackatime/callback`, and `SESSION_COOKIE_SAMESITE=None` on Render, or leave them unset to use these deployment defaults. Remove any old localhost overrides.
- Register `https://starkos-backend.onrender.com/api/hackatime/callback` as the OAuth callback URL in Hackatime.

Session cookies use `Secure`, `HttpOnly`, and `SameSite=None` with this HTTPS backend. Browsers that block third-party cookies can still block sessions between Vercel and Render; using frontend and backend subdomains under the same site avoids that limitation.

## How Hackatime works

StarkOS connects to Hackatime through OAuth. After connecting, Flask stores the access token in the session and uses it to request coding activity.

## My favorite part

The Command Center is the main page. It has the focus timer, coding information, streak, weather, and a terminal that can control some of the features.

I wanted StarkOS to feel like a personal system that I built for myself instead of another ordinary to-do list.

## Project status

The main features are working. I am currently doing final styling, deployment, and bug fixes.
