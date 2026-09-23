import { useState, useEffect } from "react";

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
                        .map(([data, hours]) => ({date, hours}))

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
                    <table>
                        <tr>
                            day7 day6 day 5 day4 day3 day2 day1
                        </tr>
                        <tr>
                        </tr>
                    </table>
                </div>
            </section>
        </main>
    )
}
// honestly wil be a blast (this)
export default CodingIntel;
