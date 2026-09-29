import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function LangBreakdown() {
    const [recentLang, setRecentLang]= useState("")
    const [mostUsedLang, setMostUsedLang] = useState("")
    const [mostLangHours, setMostLangHours] = useState("")
    const [mostPercent, setMostPercent] = useState("")    
    const [statement, setStatement] = useState("")

    useEffect(()=>{
        fetch("http://localhost:5000/hackatime/lang-breakdown")
            .then(async response => {
                const data = response.json()
                return data
            })
            .then(data => {
                setMostUsedLang(data.most_used.name)
                setMostLangHours(data.most_used.hours)
                setMostPercent(data.most_used.percent)
                setStatement(data.statement)
            })
    })

    return (
        <main>
            <Link to="/coding">🔙</Link>
            <h1>Language Breakdown</h1>
            <h2>Most Used Language</h2>
            <p>Most Used Lang: {mostUsedLang}</p>
            <p>Percent Used</p>
            <p></p>
        </main>
    )
}

export default LangBreakdown
