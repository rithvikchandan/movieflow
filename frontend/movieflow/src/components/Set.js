import React from 'react'
import Movie from './Movie'
import "../css/Set.css";
export default function Set(props) {
   console.log(props.data)
  return (
    <div className='Main-Set'>
     <h1>{props.title} {props.Language}</h1>
     <div className='movies'>
          {props.data ? props.data.map((item)=>{
               return <Movie link={item.poster_path != null ? `https://image.tmdb.org/t/p/original${item.poster_path}` : "none"} name={item.title} year={item.release_date} genre={item.genre_ids} id={item.id}/>
          }):"No data to show"}
     </div>
    </div>
  )
}
