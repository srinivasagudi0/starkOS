import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CommandCenter from "CommandCenter.jsx";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App