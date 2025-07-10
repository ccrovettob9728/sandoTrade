import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LiveTickChart from './componentes/LiveTicketChart'

function App() {
  const [count, setCount] = useState(0)

  return (
    <LiveTickChart/>
  )
}

export default App
