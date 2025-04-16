import Home from './pages/home.jsx'
import {Routes, Route} from 'react-router'
import './App.css'
import Login from './pages/log_in.jsx'
import Signup from './pages/sign_up.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  )
}

export default App
