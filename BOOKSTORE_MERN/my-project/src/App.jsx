import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import './globalStyles.css';
import Footerpage from '../src/home/FooterPage';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <div className='min-h-screen'>
        <Outlet />
        </div>
      <Footerpage />
    </>
  )
}

export default App
