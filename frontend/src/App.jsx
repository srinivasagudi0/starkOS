import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import CommandCenter from './CommandCenter.jsx'
import CodingIntel from './codingIntelligence.jsx'
import WeekDetails from './WeekDetails.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link>
      <Link to="/coding">Coding Intelligence</Link>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
        <Route path="/coding" element={<CodingIntel />} />
        <Route path='/week-details' element={<WeekDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App