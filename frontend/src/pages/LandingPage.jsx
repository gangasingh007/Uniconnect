import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <div className='landing-container'>
        <div className="header">
            <h1>Welcome to <span> UniConnect</span></h1>
            <p>Your One Stop solution to all the hassle. Access your Computer Science and elective course materials</p>
        </div>
        <div className="btn-container">
            <button onClick={()=>navigate("/register")}>
                 Get Started
            </button>
            <button onClick={()=>navigate("/login")}>
                Login
            </button>
        </div>

        <div className="feature-card">

        </div>
    </div>
  )
}

export default LandingPage