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
        <main className="more-lang">
            <Link to="/coding">🔙</Link>
            <h1 className="title5">Detailed Language Breakdown</h1>

            {loading ? (
                <p>Loading languages...</p>
            ) : error ? (
                <p role="alert">{error}</p>
            ) : (
                <>
                    <section className="most-used-language">
                        <h2>Most Used Language ~ Last 7 Days</h2>
                        <p><span>Most Used Lang: </span>{mostUsedLang}</p>
                        <p><span>Percent Used: </span>{mostPercent}%</p>
                        <p><span>Coding Time: </span>{mostLangHours} hours</p>
                        <p>{statement}</p>
                            <p className="icon" aria-hidden="true">📅</p>
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

