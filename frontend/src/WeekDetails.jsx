import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function WeekDetails() {

    const [totalHours, setTotalHours] = useState(0)
    const [activeDays, setActiveDays] = useState(0)
    const [averageHours, setAverageHours] = useState(0)
    const [dailyHours, setDaily] = useState(0)
    const [busiestHours, setBusiestHours]= useState(0)
    const [topProject, setTopProject] = useState("")
    const [topLang, setTopLang] = useState("")

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
        <main>
            <Link to="/coding">🔙</Link>
            <h1>Your Week in Code</h1>
            
        </main>
    )
}

export default WeekDetails

