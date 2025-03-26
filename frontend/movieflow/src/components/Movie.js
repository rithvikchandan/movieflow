import React, { useState } from 'react'
import {useNavigate} from "react-router-dom";
import "../css/Dash.css"
import img from "../image/mvbg.jpg";

  

export default function Movie(props) {
    const nav=useNavigate();
    const [load,setload]=useState(false);
    const genreMap = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
    };
  return (
    <div className={props.fid ? "MovieUnit "+props.fid:"MovieUnit"} onClick={()=> nav("/movie/"+props.id,{state:{id: props.id}})}>
        <img id="poster" onLoad={()=> setload(true)} src={props.link==="none" ? img:load ? props.link:img}></img>
        <div className='details'>
            <h4>{props.name}</h4>
            <h5>{new Date(props.year).getFullYear() ? new Date(props.year).getFullYear():""}</h5>
            
            <div className='genres'>
                {props.genre ? props.genre.slice(0,3).map(items => <p id="genreUnit">{genreMap[items] || "Unknown"}</p>):""}
            </div>
            
        </div>
    </div>
  )
}
