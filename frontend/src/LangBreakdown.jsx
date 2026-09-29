import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function LangBreakdown() {
    const [mostUsedLang, setMostUsedLang] = useState("")
    const [mostLangHours, setMostLangHours] = useState(0)
    const [mostPercent, setMostPercent] = useState(0)
    const [statement, setStatement] = useState("")
    const [langs, setLangs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetch("http://localhost:5000/hackatime/lang-breakdown/more", {
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
                setMostUsedLang(data.most_used?.name ?? "No activity")
                setMostLangHours(data.most_used?.hours ?? 0)
                setMostPercent(data.most_used?.percent ?? 0)
                setStatement(data.statement)
                setLangs(data.langs ?? [])
            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false))
    }, [])

    return (
        <main>
            <Link to="/coding">🔙</Link>
            <h1>Language Breakdown</h1>

            {loading ? (
                <p>Loading languages...</p>
            ) : error ? (
                <p role="alert">{error}</p>
            ) : (
                <>
                    <section className="most-used-language">
                        <h2>Most Used Language · Last 7 Days</h2>
                        <p>Most Used Lang: {mostUsedLang}</p>
                        <p>Percent Used: {mostPercent}%</p>
                        <p>Coding Time: {mostLangHours} hours</p>
                        <p>{statement}</p>
                    </section>

                    <section className="all-languages">
                        <h2>Languages Used · Last 7 Days</h2>

                        {langs.map(language => (
                            <div key={language.name} className="langs-row">
                                <h3>{language.name}</h3>
                                <p>{language.text}</p>
                                <p>{language.percent}%</p>
                            </div>
                        ))}
                    </section>
                </>
            )}
        </main>
    )
}

export default LangBreakdown

