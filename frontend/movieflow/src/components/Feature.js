import React from 'react'
import "../css/nav.css"
export default function Feature(props) {
  return (
    <div className='featurecard'>
      <h1>{props.title}</h1>
      <p>{props.desc}</p>
      <p id="why">{props.why}</p>
    </div>
  )
}
