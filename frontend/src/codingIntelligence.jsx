import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CodingIntel() {

    const [days, setDays] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        fetch("http://localhost:5000/hackatime/past7days", {
            credentials: "include"
        })
            .then(async response => {
                const data = await response.json()
                if (!response.ok) {
                    throw new Error(data.message || "Couldn't load coding hours.")
                }
                return data
            })
            .then(data => {
                setDays(
                    Object.entries(data)
                        .sort(([a],[b]) => a.localeCompare(b))
                        .map(([date, hours]) => ({date, hours}))

                ) // turns python dict to something rwact can follow
            })
            .catch(error => setError(error.message))
    }, [])

    const maxHours = Math.max(1, ...days.map(day => day.hours))
    const totalHours = days.reduce((total, day) => total + day.hours, 0)

    return(
        <main className="coding-intel">
            <section>
                <div className="title2">
                    <h1>Coding Intelligence</h1>
                </div>
                <div className="last-7-days">
                    <h1>Last 7 Days</h1>
                    <Link to="/week-details" className="more-button">More ➡️</Link>
                    {error ? (
    <p>{error}</p>
    ) : days.length === 0 ? (
    <p>Loading coding hours…</p>
    ) : (
    <>
    <p className="description">
      {totalHours.toFixed(2)} hours
    </p>
    <p className="description"> 
      {days[0].date} — {days[6].date}
    </p>

    <div className="week-heatmap">
      {days.map(day => {
        const color = 20 + (day.hours / maxHours) * 65

        return (
        <div className="heatmap-day" key={day.date}>
            <h1>
              {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                undefined,
                { weekday: "short" }
              )}
            </h1>

            <div
              className="heatmap-cell"
              tabIndex={0}
              aria-label={`${day.date}: ${day.hours} coding hours`}
              style={{ backgroundColor: `hsl(0, 0%, ${color}%)` }}
            >
              <span className="heatmap-detail">
                {day.hours} hrs
            </span>
            </div>
        </div>
)})}
        </div>
            </>
            )}
        </div>
            </section>
        </main>
    )
}
// honestly wil be a blast (this)
export default CodingIntel;
