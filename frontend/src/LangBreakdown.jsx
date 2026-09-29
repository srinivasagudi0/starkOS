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
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const [quizMessage, setQuizMessage] = useState("")

    useEffect(() => {
        fetch("http://localhost:5000/hackatime/lang-breakdown/quiz", {
            credentials: "include"
        })
            .then(async response => {
                const data = await response.json()
                return data
            })
            .then(data => {
                setQuestions(data.questions ?? [])
                setQuizMessage(data.message ?? "")
            })
            .catch(error => setQuizMessage(error.message))
    }, [])

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
                    <section className="fun-quiz">
                        <h2>Know Your Code</h2>
                        <p>{quizMessage}</p>
                        
                        {questions.map(question => (
                            <fieldset key={question.id}>
                                <legend>{question.question}</legend>

                                {question.options.map(option => (
                                    <label key={option}>
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={option}
                                            checked={answers[question.id] === option}
                                            onChange={() => setAnswers(previous => ({
                                                ...previous,
                                                [question.id]: option
                                            }))}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </fieldset>
                        ))}
                    </section>
                </>
            )}
        </main>
    )
}

export default LangBreakdown

