import { useState, useEffect } from "react"

function CommandCenter() {

  const [codeHours, setCodeHours] = useState(0)
  const [targetHours, setTargetHours] = useState(0)
  const [hourPercent, setPercentHour] = useState(0)
  const [focusMins, setFocusMins] = useState(50)
  const [timeLeft, setTimeLeft]  = useState( 50 * 60) // 50 mins of 60 secs
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return 

    const timer = setInterval(() => {
      const endTime = Number(localStorage.getItem("focusEndTime"))

      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))

      setTimeLeft(remaining)

      if (remaining === 0) {
        setIsRunning(false)
        localStorage.removeItem("focusEndTime")

      if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("Focus session complete!")
      }       
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning])

  async function toggleTimer() {
    if (isRunning) {
      setIsRunning(false)
      localStorage.removeItem("focusEndTime")
      return 
    }

    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }

    const endTime = Date.now() + timeLeft * 1000

    localStorage.setItem("focusEndTime", endTime)
    localStorage.setItem("focusMins", focusMins)

    setIsRunning(true)
  }

  const [streak, setStreak] = useState(0)

  useEffect(() =>{
    fetch("http://localhost:5000/hackatime/streaks", {
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {setStreak(data.streak)}
      })
      .catch((error) => console.error(error))
  }, [])

  

  useEffect(() => {
    fetch('http://localhost:5000/hackatime/hours',{credentials: "include"})
      .then((response) => response.json())
      .then((data) => {
        setCodeHours(data.hours)
        setTargetHours(data.target_hours)
        setPercentHour(data.percent)
      })
      .catch((error) => {console.error(error)})
      
  }, [])
  const displayMinutes = Math.floor(timeLeft / 60)
  const displaySeconds = timeLeft % 60

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

  useEffect(() => {
    const savedMinutes = Number(localStorage.getItem("focusMins"))
    const savedEndTime = Number(localStorage.getItem("focusEndTime"))

    if (savedMinutes) {setFocusMins(savedMinutes)}
    if (savedEndTime > Date.now()) {
      setTimeLeft(Math.ceil((savedEndTime - Date.now()) / 1000))
      setIsRunning(true)
    } else if (savedMinutes) {
      setTimeLeft(savedMinutes * 60)
    }
  }, [])

  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    fetch('/feedback/line')
      .then(response => response.json())
      .then((data) => setFeedback(data.message))
      .catch((error) => {console.error(error)})
  }, [])
  
  

  return (
    <main className="command-center">
        <div className="title1">
            <h1>Command Center</h1>
            <p>{feedback}</p>
        </div>
        <div className="todays-code">
            <h1>CODED HOURS</h1>
            <p>{codeHours}hrs / {targetHours}hrs</p>
            <p style={{textAlign:"center", fontSize: "20px"}}>{hourPercent}%</p>
            <h1 className="dash">___________________</h1>
            <h1 className="under-dash"></h1>
            <p>{date}</p>
        </div>

        <section className="focus-channel">
          <div className="focus-label">
            <span className="label-line"></span>
            <p>CHANNEL 02</p>
            <span className="label-line"></span>
          </div>

          <h2>Focus Session</h2>

        <div className="focus-display">
          {String(displayMinutes).padStart(2, "0")}:
          {String(displaySeconds).padStart(2, "0")}
        </div>

        <div className="controls-focus">
          {[25, 50, 90].map((minutes) => (
          <button
          key={minutes}
          className={focusMins === minutes ? "selected" : ""}
          onClick={() => {
            setFocusMins(minutes) 
            setTimeLeft(minutes *60)
            setIsRunning(false)

            localStorage.setItem("focusMins", minutes)
            localStorage.removeItem("focusEndTime")


          }}
          >
          {minutes} Min
        </button>
        ))}
        </div>

      <button className="begin-focus" onClick={toggleTimer}>
        {isRunning ? "pause session" : "Begin Session ->"}
      </button>
    </section>

    <section className="streak-station">
        <h1 className="streak-title">Spot III || Streak'o Meter</h1>
        <div className="streak-number">
          {String(streak).padStart(2, "0").split("").map((digit, index) => (
            <span key={index}>[{digit}]</span>
          ))}
        </div>

        <p className="description">Consecutive Coding Days</p>
    </section>
    </main>
  )
}

// hackatime fetching was a real headache but it is done
export default CommandCenter
