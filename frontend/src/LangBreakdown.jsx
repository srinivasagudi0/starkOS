import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function LangBreakdown() {
    const [recentLang, setRecentLang]= useState("")
    const [mostUsedLang, setMostUsedLang] = useState("")
    const [mostLangHours, setMostLangHours] = useState("")
    const [mostPercent, setMostPercent] = useState("")    
    const [statement, setStatement] = useState("")


    useEffect(()=>{
        fetch("http://localhost:5000/hackatime/lang-breakdown/more")
            .then(async response => {
                const data = await response.json()
               return data
            })
            .then(data => {
                setMostUsedLang(data.most_used?.name ?? "No activiity")
                setMostLangHours(data.most_used?.hours ?? 0)
                setMostPercent(data.most_used?.percent ?? 0)
                setStatement(data.statement)
            })
            .catch(error => setStatement(error.message))
    }, [])

    return (
        <main>
            <Link to="/coding">🔙</Link>
            <h1>Language Breakdown</h1>
            <section className="most-used-language">
            <h2>Most Used Language</h2>
            <p>Most Used Lang: {mostUsedLang}</p>
            <p>Percent Used: {mostPercent}%</p>
            <p>Coding Time: {mostLangHours} hours</p>
            <p>{statement}</p>  
            </section>
            <h2>Every Language You have ever coded</h2>
            <p></p>
            <section>
            </section>
        </main>
    )
}

export default LangBreakdown
