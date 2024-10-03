import React from 'react';
import './LoginForm.css';
const LoginForm = () => {
  return (
    <div className = 'wrapper'>
      <form action="">
        <h1>LogIn</h1>
        <div className="input-box">
          <input type="text" placeholder='Username' required/>
        </div>
        <div className="input-box">
          <input type="text" placeholder='Password' required/>
        </div>
      </form>
    </div>
  )
}

export default LoginForm