import { useState, useEffect } from "react"

function CommandCenter() {

  const [codeHours, setCodeHours] = useState(0)
  const [targetHours, setTargetHours] = useState(0)
  const [hourPercent, setPercentHour] = useState(0)
  const [focusMins, setFocusMins] = useState(50)
  const [timeLeft, setTimeLeft]  = useState( 50 * 60) // 50 mins of 60 secs
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [streakLoading, setStreakLoading] = useState(true)
  const [feedbackLoading, setFeedbackLoading] = useState(true)
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState("")

  const [command, setCommand] = useState("")
  const [terminalLines, setTerminalLines] = useState([
    "StarkOS terminal ready", 
    "Type help to see commmands"
  ])

  function runCommand(event) {
    event.preventDefault()
    const text = command.trim().toLowerCase()
    
    if (!text) return

    let answer = ""

    if (text === "help") {
      answer = "Commands: help, status, weather, focus 25, focus 50, focus 90, clear"
    }

    else if (text === "status") {
      answer = `Today: ${codeHours}hrs / ${targetHours}hrs (${hourPercent}%)`
    }

    else if (text === "weather") {
      if (weather) {
        answer = `${weather.location}: ${weather.weather.temperature_2m}°F`
      } else {
        answer = "Check your weather first."
      }
    }

    else if (text === "focus 25") {

     if (isRunning) {
      answer = "A focus session is already running. Type cancel focus first."

  } else {

      const endTime = Date.now() + 25 * 60 * 1000
      setFocusMins(25)
      setTimeLeft(25 * 60)
      setIsRunning(true)

      localStorage.setItem("focusMins", 25)
      localStorage.setItem("focusEndTime", endTime)

      answer = "25 minute focus session started."

      }
    }

    else if (text === "focus 50") {
      if(isRunning) {
        answer = "A focus session is already running. Type cancel focus first."
      }
       
      else {
        const endTime = Date.now() + 50 * 60 * 1000
        setFocusMins(50)
        setTimeLeft(50*60)
        setIsRunning(true)

        localStorage.setItem("focusMins", 50)
        localStorage.setItem("focusEndTime", endTime)

        answer = "50 minute focus session started."
      }
      }

    else if (text === "focus 90") {
      if(isRunning) {
        answer = "A focus session is already running. Type cancel focus first."
      }
       
      else {
        const endTime = Date.now() + 90 * 60 * 1000
        setFocusMins(90)
        setTimeLeft(90*60)
        setIsRunning(true)

        localStorage.setItem("focusMins", 90)
        localStorage.setItem("focusEndTime", endTime)

        answer = "90 minute focus session started."
      }
      
    }

    else if (text === "clear") {
      setTerminalLines([])
      setCommand("")
      return
    }

    else {
      answer = "Command not recognized. Type help."
    }

    setTerminalLines(previous => [
      ...previous,
      `> ${text}`,
      answer
    ])

    setCommand("")
    }

  async function getWeather(event) {
    event.preventDefault()

    if (!location.trim()) {
      setWeather(null)
      setWeatherError("Please enter a city or ZIP code.")
      return
    }

    setWeatherLoading(true)
    setWeather(null)
    setWeatherError("")

    try {
      const response = await fetch("http://localhost:5000/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location: location.trim()
        })
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.weather || "Weather failed")
      }
      setWeather(data)
      setWeatherError("")    
    } catch(error) {
        setWeatherError(error.message)
    } finally {
        setWeatherLoading(false)
    }
  }


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
    setStreakLoading(true)
    fetch("http://localhost:5000/hackatime/streaks", {
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {setStreak(data.streak)}
      })
      .catch((error) => console.error(error))
      .finally(() => setStreakLoading(false))
  }, [])

  

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/hackatime/hours',{credentials: "include"})
      .then((response) => response.json())
      .then((data) => {
        if (data.connected) {
        setCodeHours(data.hours)
        setTargetHours(data.target_hours)
        setPercentHour(data.percent)
      }})
      .catch((error) => {console.error(error)})
      .finally(() => setLoading(false))
      
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
    setFeedbackLoading(true)
    fetch("http://localhost:5000/feedback/line")
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {setFeedback(data.message)}
      })
      .catch((error) => console.error(error))
      .finally(() => setFeedbackLoading(false))
  }, [])
  

  return (
    <main className="command-center">
        {loading || streakLoading || feedbackLoading ? (
          <p className="loading-message">
            Welcome back — synchronizing your command center...
          </p>
        ) : (
        <>
        <div className="title1">
            <h1>Command Center</h1>
            <p style={{"color": "#2284a2"}}>{feedback}</p>
        </div>
        <div className="todays-code">
            <h1>CODED HOURS</h1>
            <p>{codeHours}hrs / {targetHours}hrs</p>
            <p style={{textAlign:"center", fontSize: "20px"}}>{hourPercent}%</p>
            <h1 className="dash">___________________</h1>
            <h1 className="under-dash"></h1>
            <p>{date}</p>
        </div>
        
        <section className="terminal">
          <h2>Command Center</h2>
          <div className="terminal-output">
            {terminalLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <form onSubmit={runCommand}>
            <span>&gt;</span>
            <input
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="enter command..."
              autoComplete="off"
              />
          </form>

        </section>

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

    <section className="weather-card">
          <h2>Local Weather</h2>
          <form onSubmit={getWeather}>
            <input
              value={location}
              onChange={event => setLocation(event.target.value)}
              placeholder="City or Zip Code"
            />
            <button type="submit">Check</button>
          </form>

          {weatherLoading ? (
            <p className="section-loading">Checking the skies for you...</p>
          ) : weatherError ? (
            <p>{weatherError}</p>
          ) : weather ? (
            <div>
              <h3>{weather.location}, {weather.country}</h3>
              <p>{weather.weather.temperature_2m} ℉</p>
              <p>Wind: {weather.weather.wind_speed_10m} mph</p>
              <p>Humidity: {weather.weather.relative_humidity_2m}%</p>
            </div>
          ) : null}
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
    </>
    )}

    </main>
  )
}

// hackatime fetching was a real headache but it is done
export default CommandCenter
