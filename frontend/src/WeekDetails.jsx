import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function WeekDetails() {

    const [totalHours, setTotalHours] = useState(0)
    const [activeDays, setActiveDays] = useState(0)
    const [averageHours, setAverageHours] = useState(0)
    const [dailyHours, setDaily] = useState({})
    const [busiestHours, setBusiestHours]= useState(0)
    const [topProject, setTopProject] = useState(null)
    const [topLang, setTopLang] = useState(null)

    useEffect(() =>{
        fetch('http://localhost:5000/hackatime/week-details', {
            credentials: "include"
        })
            .then(async response => {
                const data= await response.json()
                return data
            })
            .then(data => {
                setTotalHours(data.total_hours),
                setActiveDays(data.active_days),
                setAverageHours(data.average),
                setDaily(data.daily_hours),
                setBusiestHours(data.busiest_day),
                setTopProject(data.top_project),
                setTopLang(data.top_langs)
            })
            .catch(error => console.error(error))
    }, [])

    return (
    <main className="week-details">
        <Link to="/coding">← Back</Link>
        <h1>Your Week in Code</h1>

        <section className="week-overview">
        <h2>Week Overview</h2>
        <p>Total: {totalHours} hours</p>
        <p>Active days: {activeDays} / 7</p>
        <p>Daily average: {averageHours} hours</p>
        </section>

        <section className="daily-breakdown">
            
            <h2>Daily Breakdown</h2>

            {Object.entries(dailyHours).map(([date, hours]) => (
                <div className="daily-row" key={date}>
                <span>{date}</span>

                <div className="daily-track">
                    <div
                    className="daily-fill"
                    style={{
                        width: `${(hours / Math.max(1, ...Object.values(dailyHours))) * 100}%`
                    }}
                    />
                </div>

                <span>{hours} hrs</span>
                </div>
            ))}
        </section>

        <section>
        <h2>Weekly Highlights</h2>
        <p>Busiest day: {busiestHours || "No data"}</p>

        <p>
            Top project: {topProject ?? "No data"}
        </p>

        <p>
            Top language: {topLang ?? "No data"}

        </p>
        </section>
    </main>
    )
}

export default WeekDetails

