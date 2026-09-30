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
    const [quizResult, setQuizResult] = useState(null)
    const [quizLoading, setQuizLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [takingQuiz, setTakingQuiz] = useState(false)

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
                setStatement(data.statement ?? "")
                setLangs(data.langs ?? [])
            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false))
    }, [])

    async function startQuiz() {
        if (loading || quizLoading || questions.length > 0 || takingQuiz) return

        setTakingQuiz(true)
        setQuizLoading(true)
        setQuizMessage("")
        setAnswers({})
        setQuizResult(null)

        try {
            const response = await fetch(
                "http://localhost:5000/hackatime/lang-breakdown/quiz",
                {
                    credentials: "include"
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Couldn't load quiz.")
            }

            setQuestions(data.questions ?? [])
            setQuizMessage(data.message ?? "")
        } catch (error) {
            setQuizMessage(error.message)
        } finally {
            setQuizLoading(false)
            setTakingQuiz(false)
        }
    }

    async function SubmitQuiz() {
        if (
            submitting ||
            quizResult !== null ||
            questions.length === 0 ||
            questions.some(question => !answers[question.id])
        ) return

        setSubmitting(true)
        setQuizMessage("")

        try {
            const response = await fetch(
                "http://localhost:5000/hackatime/lang-breakdown/quiz/submit",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ answers })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Couldn't submit quiz.")
            }

            setQuizResult(data)
        } catch (error) {
            setQuizMessage(error.message)
        } finally {
            setSubmitting(false)
        }
    }

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

                        <p>
                            <span>Most Used Lang: </span>
                            {mostUsedLang}
                        </p>

                        <p>
                            <span>Percent Used: </span>
                            {mostPercent}%
                        </p>

                        <p>
                            <span>Coding Time: </span>
                            {mostLangHours} hours
                        </p>

                        <p>{statement}</p>
                        <p className="icon" aria-hidden="true">📅</p>
                    </section>

                    <section className="all-languages">
                        <h2>Languages Used · Last 7 Days</h2>
                        {questions.length > 0 && quizResult === null ? (
                            <div className="hidden-stats">
                                <span>You are taking a quiz, finish it to see this.</span>
                            </div>
                        ): (
                        langs.map(language => (
                            <div key={language.name} className="lang-row">
                                <h2>{language.name}</h2>
                                <p>{language.text}</p>
                                <p>{language.percent}%</p>
                            </div>
                        ))
                    )}
                        
                    </section>

                    <section className="fun-quiz">
                        <h2>Know Your Code ~ <span>Last 7 days</span></h2>
                        

                        {quizMessage && (
                            <p role="status">{quizMessage}</p>
                        )}

                        {questions.length === 0 && (
                            <button
                                type="button"
                                onClick={startQuiz}
                                disabled={quizLoading}
                                className="quiz-button"
                            >
                                {quizLoading ? "Loading quiz..." : "Start Quiz"}
                            </button>
                        )}

                        {questions.map(question => (
                            <fieldset
                                key={question.id}
                                disabled={submitting || quizResult !== null}
                            >
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

                        {questions.length > 0 && (
                            <button
                                type="button"
                                onClick={SubmitQuiz}
                                disabled={
                                    submitting ||
                                    quizResult !== null ||
                                    questions.some(question => !answers[question.id])
                                }
                                className="quiz-button"
                            >
                                {submitting ? "Checking..." : "Check Answers"}
                            </button>
                        )}

                        {quizResult && (
                            <div className="quiz-results">
                                <h3>
                                    You scored {quizResult.score}/{quizResult.total}
                                </h3>

                                {quizResult.results.map(result => (
                                    <div key={result.id}>
                                        <h4>
                                            {questions.find(
                                                question => question.id === result.id
                                            )?.question}
                                        </h4>

                                        <p>
                                            {result.correct ? "Correct!" : "Not quite."}
                                        </p>

                                        <p>
                                            Correct answer: {result.correct_answers.join(" or ")}
                                        </p>

                                        <p>{result.explanation}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    )
}
//just felt lik emakein the formsttiing look mpre clean and tufff
export default LangBreakdown