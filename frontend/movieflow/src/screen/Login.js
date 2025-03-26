import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
const blink = "http://localhost:3144"
export default function Login() {
  const nav = useNavigate();
  const [msg,setmsg]=useState("");// this is used for warning message
  const [log,setlog]=useState(true);// used to toggle between login and signup
  const [data,setdata]=useState({// this is used to store form data
    email: "",
    password: "",
    cpassword: "",
  })
  const toggleLog=()=>{ // this toggles log state between login and signup
    setlog(!log);
    setdata({
      email: "",
      password: "",
      cpassword: ""
    });// we clear all input fields as we are changing login or signup
  }
  const handleChange=(e)=>{
    setdata({...data,[e.target.name]:e.target.value});// on typing on input field it will update based on name of input field
  }
  const sendData=async()=>{
    try{
      const data1 = await fetch(blink+"/api/login",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"// a post request to backend via /api/login link
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          cpassword: data.cpassword
        })
      })
      const resp = await data1.json();
      if(resp.success){
        setmsg("");
        localStorage.setItem("email",data.email);
        nav("/home");// if we get success as true from backend, we can move on to home page
        setdata({
          email: "",
          password: "",
          cpassword: ""
        }); // we clear all input fields as user is authenticated
      }else{
        setmsg(resp.message);
      }
      
    }catch(e){
      console.log(e);
    }
  }

  const sendData2=async()=>{
    try{
      const data1 = await fetch(blink+"/api/signup",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"// a post request to backend via /api/signup link
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          cpassword: data.cpassword
        })
      })
      const resp = await data1.json();
      if(resp.success){
        setmsg("");
        localStorage.setItem("email",data.email);
        nav("/home");// if we get success as true from backend, we can move on to home page
        setdata({
          email: "",
          password: "",
          cpassword: ""
        }); // we clear all input fields as user is authenticated
      }else{
        setmsg(resp.message);
      }
      
    }catch(e){
      console.log(e);
    }
  }
  return (
    <div>
      <Nav />
      <div className="Login">
        <div className="Form">
          <h1>{log ? "Log In":"Sign Up"} to Your MovieFlow Account</h1>
          <input type="email" name="email" placeholder="Email" autoComplete="off" value={data.email} onChange={handleChange}/>
          <input type="password" name="password" placeholder="Password" value={data.password} onChange={handleChange}/>
          {!log ? <input type="password" name="cpassword" placeholder="Confirm Password" value={data.cpassword} onChange={handleChange}/>:""}
          {msg ? <h2>{msg}</h2>:""}
          {log ? <button onClick={sendData}>Login</button>:<button onClick={sendData2}>Sign Up</button>}
          <p>{log ? "New to MovieFlow?":"Already been with MovieFlow?"}<span onClick={()=>toggleLog()}>{!log ? " Login":" Sign Up"}</span></p>
        </div>
      </div>

      <div className="footer">
        <p>&copy; 2024 MovieFlow. All rights reserved. | Powered by TMDb.</p>
      </div>
    </div>
  );
}
