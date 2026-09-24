import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function WeekDetails() {

    const [totalHours, setTotalHours] = useState(0)

    useEffect(() =>{
        fetch('http://localhost:5000/hackatime/week-details', {
            credentials: "include"
        })
            .then(async response => {
                const data= await response.json()
                return data
            })
            .then(data => {
                setTotalHours(data.total_hours)
            })
            .catch(error => console.error(error))
    }, [])

    return (
        <main>
            <Link to="/coding">🔙</Link>
            <h1>Your Week in Code</h1>
            <p>{totalHours}</p>
        </main>
    )
}

export default WeekDetails

