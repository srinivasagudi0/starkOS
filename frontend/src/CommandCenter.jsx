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
    
    setTimeLeft((previousTime) => {
      if (previousTime <= 1) {
        setIsRunning(false)
        
        return 0
      }
      
      return previousTime - 1
    })
  }, 1000)
  
  return () => clearInterval(timer)
}, [isRunning])

  

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
  

  return (
    <main className="command-center">
        <div className="title1">
            <h1>Command Center</h1>
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
          onClick={() => setFocusMins(minutes)}
          >
          {minutes} Min
        </button>
        ))}
        </div>

      <button className="begin-focus" onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "pause sesspon" : "Begin Session ->"}
      </button>
    </section>
 
    </main>
  )
}

// hackatime fetching was a real headache but it is done
export default CommandCenter