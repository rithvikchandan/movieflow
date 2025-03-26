import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../css/Dash.css"
import logo from "../image/Logo.png"

import Movie from '../components/Movie';
import Set from '../components/Set';
const blink = "https://movieflow.onrender.com"

export default function Dash() {
  const [txt, settxt] = useState("");
  const [lang,setlang] = useState("te");
  const [hover,sethover] = useState(false);
  const [trend,settrend] = useState({});
  const [recent,setrecent] = useState({});
  const [upcoming,setupcom] = useState({});
  const [search, setsearch] = useState(false);
  const [playadd,setplayadd] = useState("Add Playlist");
  const [viewData,setview] = useState({});
  const [recommend,setrec] = useState([]);
  const nav = useNavigate();
  const [data, setdata] = useState({});
  const [playdata, setplaydata] = useState([]);
  const changeSearch = (e) => {
    settxt(e.target.value);
  }
  const AddPlaylist=async(arr)=>{
    try {
      const data1 = await fetch(blink + "/api/addPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"// a post request to backend 
        },
        body: JSON.stringify({
          array:arr,
          email: localStorage.getItem("email")
        })
      })
      const resp = await data1.json();

      if (resp.success) {
        setplayadd("Playlist Added to your Watchlist");
      } else {
        alert(resp.message);
      }

    } catch (e) {
      console.log(e);
    }
  }
  const setviewData=(e)=>{
    sethover(true);
    setview((playdata.filter((item)=> item.id==e))[0]);
  }
  const playlistData = async (langu) => {
    try {
      const data1 = await fetch(blink + "/api/getPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"// a post request to backend 
        },
        body: JSON.stringify({
          language: langu,
          email: localStorage.getItem("email")
        })
      })
      const resp = await data1.json();

      if (resp.success) {
        settrend(resp.trending);
        setrecent(resp.recent);
        setupcom(resp.upcoming);
        setplaydata(resp.data);
        setrec(resp.recommendations);
      } else {
        alert("Sorry")
      }

    } catch (e) {
      console.log(e);
    }
  }
  const sendData = async () => {
    try {
      const data1 = await fetch(blink + "/api/getMovie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"// a post request to backend via /api/getMovie link
        },
        body: JSON.stringify({
          search: txt
        })
      })
      const resp = await data1.json();

      if (resp.success) {

        setdata(resp.data);
      } else {
        alert(resp.message);
      }

    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    playlistData(lang);
  }, [])
  return (
    <div>
      <div className='navtop'>
        <img src={logo} onClick={() => nav(localStorage.getItem("email") ? "/home" : "/")} width={150} height={65} />
        {!search ? <p onClick={() => { setsearch(!search) }}>Search</p> : ""}
        {!search ? <p onClick={() => { nav("/watchlist") }}>Watchlist</p> : ""}
        {search ? <div className='inps'>
          <input id="search1" type='text' autoComplete='off' placeholder='Search any Movie...' value={txt} onChange={changeSearch}></input>
          {txt.length > 0 ? <button id="btn" onClick={sendData}>🔍</button> : <button id="btn" onClick={() => { setsearch(!search) }}>❌</button>}
        </div> : ""}
      </div>
      
      {!data.results ? <div className='lang'><button style={lang=='te'?{backgroundColor:"#FFD700",color:"#3b3b3b"}:{}} onClick={()=>{setlang("te"); playlistData("te");}}>Telugu</button>
        <button style={lang=='hi'?{backgroundColor:"#FFD700",color:"#3b3b3b"}:{}} onClick={()=>{setlang("hi"); playlistData("hi");}}>Hindi</button>
        <button style={lang=='en'?{backgroundColor:"#FFD700",color:"#3b3b3b"}:{}} onClick={()=>{setlang("en"); playlistData("en");}}>English</button></div>:""}
      <div className='movie'>
        {data.results ?
          data.results.map(item => <Movie link={item.poster_path != null ? `https://image.tmdb.org/t/p/original${item.poster_path}` : "none"} name={item.title} year={item.release_date} genre={item.genre_ids} id={item.id} />)
          : ""}
      </div>
      {recommend ? <div>
        <h1>Your Personalized Movie Picks: Handpicked Just for You! 🎬✨</h1>

        <div className='moviesRecommended'>
                
                {recommend.length>0 ? recommend.map((item)=>{
                     return <Movie link={item.poster_path != null ? `https://image.tmdb.org/t/p/original${item.poster_path}` : "none"} name={item.title} year={item.release_date} genre={item.genre_ids} id={item.id}/>
                }):<h3>We can't recommend movies right now. Start watching or rating to get personalized picks! 🎬🍿</h3>}
           </div></div>:""}
      {trend.results ? <div className='Trending'>
        <Set data={trend.results} title={"Trending"} Language={lang=="te" ? "Telugu":lang=="hi"?"Hindi":"English"}/>
      </div>:""}

      {recent.results  && lang!="en" ? <div className='Recent'>
        <Set data={recent.results} title={"Recent"} Language={lang=="te" ? "Telugu":lang=="hi"?"Hindi":"English"}/>
      </div>:""}

      {upcoming.results && lang!="en" ? <div className='Upcoming'>
        <Set data={upcoming.results} title={"Upcoming"} Language={lang=="te" ? "Telugu":lang=="hi"?"Hindi":"English"}/>
      </div>:""}
      <div className='Playlists'>
        <div className='Telugu'>
          <h1>Tollywood Playlists</h1>
          <div className='tel-playlist'>
            {playdata ? playdata.filter((item) => item.Language === "Telugu").map((items) => {
              return <div className='unit'>
                <Movie fid={"one"} link={items.movie_1_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_1_poster}` : "none"} name={items.movie_1_name} year={items.movie_1_date} genre={items.movie_1_genre} id={items.movie_1} />
                <Movie fid={"two"} link={items.movie_2_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_2_poster}` : "none"} name={items.movie_2_name} year={items.movie_2_date} genre={items.movie_2_genre} id={items.movie_2} />
                <Movie fid={"three"} link={items.movie_3_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_3_poster}` : "none"} name={items.movie_3_name} year={items.movie_3_date} genre={items.movie_3_genre} id={items.movie_3} />
                <Movie fid={"four"} link={items.movie_4_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_4_poster}` : "none"} name={items.movie_4_name} year={items.movie_4_date} genre={items.movie_4_genre} id={items.movie_4} />
                <Movie fid={"five"} link={items.movie_5_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_5_poster}` : "none"} name={items.movie_5_name} year={items.movie_5_date} genre={items.movie_5_genre} id={items.movie_5} />
                <p className='cat'>{items.Category}</p>
                <p id='view' onClick={()=>{setviewData(items.id)}}>View Playlist</p>
              </div>
            }) : <h1>No Playlists to Show!</h1>}
          </div>
        </div>


        <div className='Hindi'>
          <h1>Bollywood Playlists</h1>
          <div className='hin-playlist'>
            {playdata ? playdata.filter((item) => item.Language === "Hindi").map((items) => {
              return <div className='unit'>
                <Movie fid={"one"} link={items.movie_1_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_1_poster}` : "none"} name={items.movie_1_name} year={items.movie_1_date} genre={items.movie_1_genre} id={items.movie_1} />
                <Movie fid={"two"} link={items.movie_2_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_2_poster}` : "none"} name={items.movie_2_name} year={items.movie_2_date} genre={items.movie_2_genre} id={items.movie_2} />
                <Movie fid={"three"} link={items.movie_3_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_3_poster}` : "none"} name={items.movie_3_name} year={items.movie_3_date} genre={items.movie_3_genre} id={items.movie_3} />
                <Movie fid={"four"} link={items.movie_4_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_4_poster}` : "none"} name={items.movie_4_name} year={items.movie_4_date} genre={items.movie_4_genre} id={items.movie_4} />
                <Movie fid={"five"} link={items.movie_5_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_5_poster}` : "none"} name={items.movie_5_name} year={items.movie_5_date} genre={items.movie_5_genre} id={items.movie_5} />
                <p>{items.Category}</p>
                <p id='view' onClick={()=>{setviewData(items.id)}}>View Playlist</p>
              </div>
            }) : <h1>No Playlists to Show!</h1>}
          </div>
        </div>

        <div className='English'>
          <h1>Hollywood Playlists</h1>
          <div className='eng-playlist'>
            {playdata ? playdata.filter((item) => item.Language === "English").map((items) => {
              return <div className='unit'>
                <Movie fid={"one"} link={items.movie_1_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_1_poster}` : "none"} name={items.movie_1_name} year={items.movie_1_date} genre={items.movie_1_genre} id={items.movie_1} />
                <Movie fid={"two"} link={items.movie_2_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_2_poster}` : "none"} name={items.movie_2_name} year={items.movie_2_date} genre={items.movie_2_genre} id={items.movie_2} />
                <Movie fid={"three"} link={items.movie_3_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_3_poster}` : "none"} name={items.movie_3_name} year={items.movie_3_date} genre={items.movie_3_genre} id={items.movie_3} />
                <Movie fid={"four"} link={items.movie_4_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_4_poster}` : "none"} name={items.movie_4_name} year={items.movie_4_date} genre={items.movie_4_genre} id={items.movie_4} />
                <Movie fid={"five"} link={items.movie_5_poster != null ? `https://image.tmdb.org/t/p/original${items.movie_5_poster}` : "none"} name={items.movie_5_name} year={items.movie_5_date} genre={items.movie_5_genre} id={items.movie_5} />
                <p>{items.Category}</p>
                <p id='view' onClick={()=>{setviewData(items.id)}}>View Playlist</p>
              </div>
            }) : <h1>No Playlists to Show!</h1>}
          </div>
        </div>
      </div>


      {hover && Object.keys(viewData).length!=0 ?
        <div className='viewPlaylist'>
             <div className='top'>
                <h1>{viewData.Category}</h1>
                <h1 onClick={()=>{sethover(false);setplayadd("Add Playlist")}}>❌</h1>
             </div>
             <div className='middle'>
                <Movie link={viewData.movie_1_poster != null ? `https://image.tmdb.org/t/p/original${viewData.movie_1_poster}` : "none"} name={viewData.movie_1_name} year={viewData.movie_1_date} genre={viewData.movie_1_genre} id={viewData.movie_1} />
                <Movie link={viewData.movie_2_poster != null ? `https://image.tmdb.org/t/p/original${viewData.movie_2_poster}` : "none"} name={viewData.movie_2_name} year={viewData.movie_2_date} genre={viewData.movie_2_genre} id={viewData.movie_2} />
                <Movie link={viewData.movie_3_poster != null ? `https://image.tmdb.org/t/p/original${viewData.movie_3_poster}` : "none"} name={viewData.movie_3_name} year={viewData.movie_3_date} genre={viewData.movie_3_genre} id={viewData.movie_3} />
                <Movie link={viewData.movie_4_poster != null ? `https://image.tmdb.org/t/p/original${viewData.movie_4_poster}` : "none"} name={viewData.movie_4_name} year={viewData.movie_4_date} genre={viewData.movie_4_genre} id={viewData.movie_4} />
                <Movie link={viewData.movie_5_poster != null ? `https://image.tmdb.org/t/p/original${viewData.movie_5_poster}` : "none"} name={viewData.movie_5_name} year={viewData.movie_5_date} genre={viewData.movie_5_genre} id={viewData.movie_5} />
             </div>
             <div className='bottomview'>
                <button onClick={()=>{AddPlaylist([viewData.movie_1,viewData.movie_2,viewData.movie_3,viewData.movie_4,viewData.movie_5])}}>{playadd}</button>
             </div>
      </div>:""}
    </div>
  )
}
