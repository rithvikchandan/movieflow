import React from 'react'
import logo from "../image/Logo.png"
import { useNavigate } from 'react-router-dom'
import "../css/nav.css"
export default function Nav() {
    const nav = useNavigate();
  return (
    <div className='navbar'>
      <img src={logo} onClick={()=>nav("/")}/>
      <div className='navitems'>
        <h2 onClick={()=>nav("/login")}>Login</h2>
      </div>
    </div>
  )
}
