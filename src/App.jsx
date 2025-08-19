import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChartComponent from './componentes/ChartComponent'
import Home from './layout/Home'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import NavBar from './componentes/NavBar'
import Sidebar from './componentes/SideBar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <NavBar/>
      <Sidebar className="min[640px]:hidden"/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comunidad" element={<div>Nosotros Page</div>} />
        <Route path="/contacto" element={<div>Contacto Page</div>} />
        <Route path="/precios" element={<div>Contacto Page</div>} />
      </Routes>
    </Router>
  )
}

export default App
