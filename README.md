# starkOS

## Hackatime login

Set these environment variables on the Flask backend:

- `FLASK_SECRET_KEY`: a stable, private session-signing key.
- `HACKATIME_ID` and `HACKATIME_SECRET`: your OAuth application credentials.
- `FRONTEND_URL`: your deployed frontend URL, including `https://`. Successful login redirects here. For local development, set it to `http://localhost:5173`.
- `HACKATIME_CALLBACK_URL`: your backend's `/api/hackatime/callback` URL. It must match the URL registered with Hackatime. It defaults to `http://localhost:5000/api/hackatime/callback` for local development.

`FRONTEND_URL` is required; login reports a configuration error if it is missing, rather than sending users to an unintended localhost page. Restart Flask after changing these settings.

For frontend and backend hosted on different sites, use HTTPS on the backend and set `SESSION_COOKIE_SAMESITE=None`. Secure cookies are enabled automatically when the callback URL uses HTTPS. Browser restrictions on third-party cookies may still require hosting both under the same site.

Command Center checks `/api/hackatime/status` with credentials included. Disconnected users see **Connect Hackatime**. That button opens the backend authorization route; the callback exchanges the code, stores the token in the Flask session, and redirects to `FRONTEND_URL`. Command Center then checks status again and loads hours and streaks. A `401` from either request shows the connection section again.

The frontend API URLs currently point to `http://localhost:5000`, as requested. When deploying the backend remotely, update those URLs to its HTTPS address. Never put the client secret or access token in frontend code or localStorage.
