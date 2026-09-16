import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CommandCenter from './CommandCenter.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App