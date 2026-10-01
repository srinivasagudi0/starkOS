import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CodingIntel() {

    const [days, setDays] = useState([])
    const [error, setError] = useState("")
    const [daysLoading, setDaysLoading] = useState(true)
    const [projects, setProjects] = useState([])
    const [projectsLoading, setProjectsLoading] = useState(true)
    const [projectsError, setProjectsError] = useState("")
    const [langs, setLangs] = useState([])
    const [langsLoading, setLangsLoading] = useState(true)
    const [langsError, setLangsError] = useState("")

    useEffect(() => {
        setDaysLoading(true)
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
            .finally(() => setDaysLoading(false))
    }, [])

    useEffect(() => {
        setProjectsLoading(true)
        fetch('http://localhost:5000/hackatime/project-breakdown', {
            credentials: "include"
        })
            .then(async response => {
                const data= await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Couldn't load projects.")
                }

                return data
            })
            .then(data => {
                setProjects(data.projects ?? [])
            })
            .catch(error => setProjectsError(error.message))
            .finally(() => setProjectsLoading(false))
    }, [])

    useEffect(() => {
        setLangsLoading(true)
        fetch('http://localhost:5000/hackatime/lang/breakdown', {
            credentials: "include"
        })
            .then(async response => {
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Couldn't load languages.")
                }

                return data
            })
            .then(data => {
                setLangs(data.langs ?? [])
            })
            .catch(error => setLangsError(error.message))
            .finally(() => setLangsLoading(false))
    }, [])

    const maxHours = Math.max(1, ...days.map(day => day.hours))
    const totalHours = days.reduce((total, day) => total + day.hours, 0)

    return(
        <main className="coding-intel">
            <section>
                <div className="title2">
                    <h1>Coding Intelligence</h1>
                    <p>Learn from what you have coded.</p>
                </div>
                <div className="last-7-days">
                    <h1>Last 7 Days</h1>
                    <Link to="/week-details" className="more-button">More ➡️</Link>
                    {daysLoading ? (
    <p className="section-loading">Pulling your seven-day signal...</p>
    ) : error ? (
    <p>{error}</p>
    ) : days.length === 0 ? (
    <p>No data</p>
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
        <section className="project-breakdown">
            <h2>Project BreakDown</h2>
            <Link to="/project-breakdown">More ➡️</Link>
            {projectsLoading ? (
                <p className="section-loading">Mapping your latest projects...</p>
            ) : projectsError ? (
                <p>{projectsError}</p>
            ) : projects.length === 0 ? (
                <p>No data</p>
            ) : projects.slice(0, 5).map(project => (
            <div key={project.name} className="project-row">
                <h3>{project.name}</h3>
                <p>{(project.total_seconds / 3600).toFixed(2)} hours total</p>
            </div>
            ))}
        </section>

        <section className="lang-breakdown">
            <h1>Language breakdown</h1>
            <Link to="/lang-breakdown">more ➡️</Link>
            <p>Where your coding time went. </p>
            <div className="langs-list">
            {langsLoading ? (
                <p className="section-loading">Reading your language activity...</p>
            ) : langsError ? (
                <p>{langsError}</p>
            ) : langs.length === 0 ? (
                <p>No data</p>
            ) : langs.slice(0, 5).map(language => (
            <div key={language.name} className="langs-row">
                <h3>{language.name}</h3>
                <div className="language-track">
                    <div
                        className="language-fill"
                        style={{ width: `${language.percent}%` }}
                    />
                </div>
                <p>{language.text} · {language.percent}%</p>
            </div>
        ))}
            </div>
        </section>
        
        </main>
    )
}
// honestly wil be a blast (this)
export default CodingIntel;
