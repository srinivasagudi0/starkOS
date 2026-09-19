import { useState, useEffect } from "react"

function CommandCenter() {

  const [codeHours, setCodeHours] = useState(0)
  const [targetHours, setTargetHours] = useState(0)

  

  useEffect(() => {
    fetch('http://localhost:5000/hackatime/hours',{credentials: "include"})
      .then((response) => response.json())
      .then((data) => {
        setCodeHours(data.hours)
        setTargetHours(data.target_seconds)
      })
      .catch((error) => {console.error(error)})
  }, [])
  

  return (
    <main className="command-center">
        <div className="title1">
            <h1>Command Center</h1>
        </div>
        <div className="todays-code">
            <h1>CODED HOURS</h1>
            <p>{codeHours} / target here</p>
            <h1 className="dash">___________________</h1>
            <h1 className="under-dash"> Date</h1>
            <p>DATE</p>
        </div>
      
    </main>
  )
}
// hackatime fetching was a real headache but it is done
export default CommandCenter
