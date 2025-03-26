import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import img from "../image/mvbg.jpg";
import "../css/Specific.css";
const blink = "http://localhost:3144";
export default function Specific() {
  const location = useLocation();
  const [memory,setMem] = useState("");
  const [wdata, setwdata] = useState({
    day: null,
    sess: null
  });
  const [but, setbut] = useState(-1);
  const [wlstat, setwl] = useState([]);
  const [review,setReview] = useState("");
  const [isRated, setRatingStatus] = useState(-1);
  const [avgRating, setAvg] = useState(0.00);
  const [leng, setlen] = useState(0);
  const [Ratingmsg, setmsg] = useState("");
  const id = location.state.id || 0;
  const [item, setItem] = useState({});
  const [reviewData,setReviewData]=useState([]);
  const handleChange = (e) => {
    setwdata({ ...wdata, [e.target.name]: e.target.value });
  }

  const sendReview=async()=>{
    try{
      const data = await fetch(blink+"/api/addReview",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          id: id,
          email: localStorage.getItem("email"),
          review: review
        }),
      })
      const resp = await data.json();
      if(resp.success){
        getMovie();
      }else{
        alert("Unable to add Memory");
      }
    }catch(e){
      console.log(e);
    }
  }
  const addMem=async()=>{
    try{
      const data1 = await fetch(blink + "/api/addMemory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          email: localStorage.getItem("email"),
          mem: memory
        }),
      });
      const resp = await data1.json();
      if(resp.success){
        window.location.reload();
      }else{
        alert("Unable to add Memory");
      }
    }catch(e){
      console.log(e);
    }
  }

  const delMem=async(k)=>{
    try{
      const data1 = await fetch(blink + "/api/delMemory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          email: localStorage.getItem("email"),
          memid: k
        }),
      });
      const resp = await data1.json();
      if(resp.success){
        window.location.reload();
      }else{
        alert("Unable to delete Memory");
      }
    }catch(e){
      console.log(e);
    }
  }
  const getMovie = async () => {
    try {
      const data1 = await fetch(blink + "/api/getSpecific", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          email: localStorage.getItem("email")
        }),
      });
      const resp = await data1.json();

      if (resp.success) {
        console.log(resp.reviews);
        setItem(resp.data);
        setbut(resp.wlData[0] ? resp.wlData[0].status == "Planned" ? 0 : resp.wlData[0].status == "Watching" ? 1 : 2: -1)
        setwl(resp.wlData);
        setwdata({ day: resp.wlData[0] ? resp.wlData[0].Day: null, sess: resp.wlData[0] ? resp.wlData[0].Session :null})
        setRatingStatus(resp.status == -1 ? -1 : resp.status);
        setAvg(resp.avg);
        setlen(resp.length);
        setReviewData(resp.reviews);
        
      } else {
        getMovie();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const sendRating = async (k) => {
    try {
      if (isRated == -1) {
        const data = await fetch(blink + "/api/sendRating", {
          //setting the rating for this movie we send id and rating to backend
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            rating: k,
            email: localStorage.getItem("email")
          }),
        });
        const resp = await data.json();
        if (resp.success) {
          setRatingStatus(k);
          console.log(avgRating, leng);
          setAvg(((avgRating * leng) + k) / (leng + 1));
          setmsg("You rated " + k + " ⭐");
        } else {
          setmsg("Sorry,Unable to rate");
        }
      } else {
        setmsg("Already Rated " + isRated + " ⭐");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const updateStatus = async (k) => {
    try {
      const data1 = await fetch(blink + "/api/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          email: localStorage.getItem("email"),
          status: k,
          day: k == 2 ? wdata.day : null,
          sess: k == 2 ? wdata.sess : null
        }),
      });
      const resp = await data1.json();
      if (resp.success) {
        setbut(k);
        if (k != 2) {
          setwdata({ day: null, sess: null })
        }

      } else {
        alert(resp.message);
      }
    } catch (e) {
      console.log(e);
    }
  }
  const modifyStatus = async () => {
    try {
      const data = await fetch(blink + "/api/modifyWL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: id,
          email: localStorage.getItem("email"),
          status: wlstat.length > 0,
          name: item.title,
          year: item.release_date ? item.release_date : null,
          genre: JSON.stringify(item.genres),
          path: item.poster_path,
          ott: Object.keys(item["watch/providers"].results).length != 0,
          theatre: item.release_date ? new Date(item.release_date) < new Date() : false
        })
      });
      const resp = await data.json();
      if (resp.success) {
        window.location.reload();
      } else {
        
        alert("Sorry,Unable to process your request")
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getMovie();
  }, []);

  const languageMap = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    zh: "Chinese",
    hi: "Hindi",
    ar: "Arabic",
    pt: "Portuguese",
    ru: "Russian",
    ko: "Korean",
    tr: "Turkish",
    pl: "Polish",
    sv: "Swedish",
    nl: "Dutch",
    fi: "Finnish",
    da: "Danish",
    no: "Norwegian",
    th: "Thai",
    el: "Greek",
    he: "Hebrew",
    cs: "Czech",
    hu: "Hungarian",
    ro: "Romanian",
    uk: "Ukrainian",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    bn: "Bengali",
    kn: "Kannada",
    mr: "Marathi",
    vi: "Vietnamese",
    id: "Indonesian",
    ms: "Malay",
    fa: "Persian",
    sr: "Serbian",
    hr: "Croatian",
    sk: "Slovak",
    sl: "Slovenian",
    bg: "Bulgarian",
    lt: "Lithuanian",
    lv: "Latvian",
    et: "Estonian",
  };

  const countryMap = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    IN: "India",
    JP: "Japan",
    KR: "South Korea",
    FR: "France",
    DE: "Germany",
    IT: "Italy",
    ES: "Spain",
    RU: "Russia",
    CN: "China",
    BR: "Brazil",
    MX: "Mexico",
    AR: "Argentina",
    ZA: "South Africa",
    SE: "Sweden",
    NL: "Netherlands",
    TR: "Turkey",
    TH: "Thailand",
    PL: "Poland",
    ID: "Indonesia",
    PH: "Philippines",
    VN: "Vietnam",
    MY: "Malaysia",
    SA: "Saudi Arabia",
    AE: "United Arab Emirates",
    EG: "Egypt",
    NG: "Nigeria",
    PK: "Pakistan",
    BD: "Bangladesh",
    IR: "Iran",
    GR: "Greece",
    IL: "Israel",
    PT: "Portugal",
    DK: "Denmark",
    FI: "Finland",
    NO: "Norway",
    IE: "Ireland",
    CH: "Switzerland",
    AT: "Austria",
    BE: "Belgium",
    HU: "Hungary",
    CZ: "Czech Republic",
    RO: "Romania",
    BG: "Bulgaria",
    UA: "Ukraine",
    SK: "Slovakia",
    HR: "Croatia",
    SI: "Slovenia",
    NZ: "New Zealand",
    SG: "Singapore",
    HK: "Hong Kong",
    TW: "Taiwan",
    CL: "Chile",
    PE: "Peru",
    CO: "Colombia",
    VE: "Venezuela",
    UY: "Uruguay",
    BO: "Bolivia",
    CR: "Costa Rica",
    CU: "Cuba",
    DO: "Dominican Republic",
    GT: "Guatemala",
    HN: "Honduras",
    SV: "El Salvador",
    NI: "Nicaragua",
    PY: "Paraguay",
    EC: "Ecuador",
    PR: "Puerto Rico",
    KE: "Kenya",
    GH: "Ghana",
    TZ: "Tanzania",
    UG: "Uganda",
    ZW: "Zimbabwe",
    SD: "Sudan",
    DZ: "Algeria",
    MA: "Morocco",
    TN: "Tunisia",
    LY: "Libya",
    QA: "Qatar",
    KW: "Kuwait",
    BH: "Bahrain",
    OM: "Oman",
    IQ: "Iraq",
    SY: "Syria",
    YE: "Yemen",
    LB: "Lebanon",
    CY: "Cyprus",
    MT: "Malta",
    IS: "Iceland",
    LU: "Luxembourg",
    LI: "Liechtenstein",
    MC: "Monaco",
    SM: "San Marino",
    VA: "Vatican City",
  };

  return (
    <div>
      {Object.keys(item).length != 0 ? (
        <div>
          <div style={{
            background: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat-y",
            width: "100%",
            height: "fit-content",
            paddingBottom: "10px"
          }}>
            <div className="head">
              <div className="poster">
                <div className="photo">
                  <img
                    src={
                      item.poster_path
                        ? "https://image.tmdb.org/t/p/original" + item.poster_path
                        : img
                    }
                  />
                  <div className="watchlist">
                    <button onClick={modifyStatus}>{wlstat.length > 0 ? "Drop from Watchlist" : "Add to Watchlist"}</button>
                    {/* checking for watchlist status of movie */}
                  </div>
                </div>

                <div className="det">
                  <h1>
                    {item.title}(
                    {new Date(item.release_date).getFullYear()
                      ? new Date(item.release_date).getFullYear()
                      : ""}
                    )
                  </h1>
                  <h2>{languageMap[item.original_language]}</h2>
                  <h2>{countryMap[item.origin_country[0]]}</h2>
                  <h2>
                    {Math.floor(item.runtime / 60)}hr {item.runtime % 60}min
                  </h2>
                  <h2>{new Date(item.release_date) > new Date() ? "Yet to be Released" : Object.keys(item["watch/providers"].results).length == 0 ? "Theatrically Released" : "Released in OTT"}</h2>
                  <div className="genres">
                    {item.genres
                      ? item.genres.map((items) => (
                        <p id="genreUnit">{items.name || "Unknown"}</p>
                      ))
                      : ""}
                  </div>
                </div>
              </div>
              <div className="prod">
                {item.production_companies.slice(0, 2).map((k) => (
                  <div>
                    <img
                      class="prod_img"
                      src={
                        k.logo_path
                          ? "https://image.tmdb.org/t/p/original" + k.logo_path
                          : img
                      }
                    />
                    <p>{k.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="body">
              <div className="Story">
                <p>{item.overview}</p>
              </div>
              <div className="WatchProviders">
                <h3>Available On</h3>
                <div>
                  {item["watch/providers"].results && item["watch/providers"].results.IN && item["watch/providers"].results.IN.flatrate ? item["watch/providers"].results.IN.flatrate.slice(0, 2).map((k) => (
                    <div className="wp">
                      <img src={
                        k.logo_path
                          ? "https://image.tmdb.org/t/p/original" + k.logo_path
                          : img
                      } width={50} height={50} />
                      <div className="wpinfo">
                        <h5>{k.provider_name}</h5>
                        <h6>Subscription</h6>
                      </div>
                    </div>
                  )) : ""}
                  {item["watch/providers"].results && item["watch/providers"].results.IN && item["watch/providers"].results.IN.rent ? item["watch/providers"].results.IN.rent.slice(0, 1).map((k) => (
                    <div className="wp">
                      <img src={
                        k.logo_path
                          ? "https://image.tmdb.org/t/p/original" + k.logo_path
                          : img
                      } width={50} height={50} />
                      <div className="wpinfo">
                        <h5>{k.provider_name}</h5>
                        <h6>Rent</h6>
                      </div>
                    </div>
                  )) : ""}
                  {item["watch/providers"].results && item["watch/providers"].results.IN && item["watch/providers"].results.IN.buy ? item["watch/providers"].results.IN.buy.slice(0, 1).map((k) => (
                    <div className="wp">
                      <img src={
                        k.logo_path
                          ? "https://image.tmdb.org/t/p/original" + k.logo_path
                          : img
                      } width={50} height={50} />
                      <div className="wpinfo">
                        <h5>{k.provider_name}</h5>
                        <h6>Buy</h6>
                      </div>
                    </div>
                  )) : ""}
                  {(Object.keys(item["watch/providers"].results).length == 0) ? <h4>Not Available to Stream</h4> : ""}
                </div>

              </div>

            </div>
          </div>

          <div className="lower">
            <div className="info">
              <p>
                <span>Release Date</span>
                <br />
                {new Date(item.release_date).getDate() && new Date(item.release_date).getFullYear() ? "":"Not Announced"}
                {new Date(item.release_date).getDate() ? new Date(item.release_date).getDate():""}{" "}
                {new Date(item.release_date).getDate() ? new Date(item.release_date).toLocaleString("en-US", {month: "short"}):""}
                {" "}{new Date(item.release_date).getFullYear() ? new Date(item.release_date).getFullYear():""}
              </p>
              <p>
                <span>Budget</span>
                <br />${(item.budget / 1000000).toFixed(1)}M
              </p>
              <p>
                <span>Revenue</span>
                <br />${(item.revenue / 1000000).toFixed(1)}M
              </p>
              <p>
                <span>TMDB Rating</span>
                <br />
                {item.vote_average}({item.vote_count} Ratings)
              </p>
            </div>
            {wlstat.length > 0 ?
              <div className="Progress">
                <h1>{but == 0 ? "Planned to Watch" : but == 1 ? "Resume Watching" : "Completed Watching"}</h1>
                
                <div className="status">
                  <button style={but == 1 ? { backgroundColor: "#FFD700", color: "#3b3b3b" } : {}} onClick={() => { updateStatus(1) }}>Watching</button>
                  <button style={but == 2 ? { backgroundColor: "#FFD700", color: "#3b3b3b" } : {}} onClick={() => { updateStatus(2) }}>Watched</button>
                </div>
                {but == 2 ? <p>When did you watch it?</p> : ""}
                {but == 2 ?
                  <select id="days" name="day" onChange={handleChange} value={wdata.day}>
                    <option value="NULL" disabled selected>Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select> : ""}
                {but == 2 ?
                  <select id="timePeriod" name="sess" onChange={handleChange} value={wdata.sess}>
                    <option value="NULL" disabled selected>Session</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select> : ""}
                {but == 2 ? <button onClick={() => (updateStatus(but))}>Save</button> : ""}
              </div> : ""}

            <div className="rate">
              <h1>Rate</h1>
              <div>
                <button className="btn1" onClick={() => sendRating(1)} >
                  1 ⭐
                </button>
                <button className="btn1" onClick={() => sendRating(2)} >
                  2 ⭐
                </button>
                <button className="btn1" onClick={() => sendRating(3)} >
                  3 ⭐
                </button>
                <button className="btn1" onClick={() => sendRating(4)} >
                  4 ⭐
                </button>
                <button className="btn1" onClick={() => sendRating(5)} >
                  5 ⭐
                </button>
              </div>
              <h2>{Ratingmsg}</h2>
              <p>{avgRating ? avgRating.toFixed(2) : 0.00} ⭐</p>
            </div>
          </div>
          {but == 2 ?
            <div className="memory">
              <div id="head">
                <img src={"https://ouch-cdn2.icons8.com/8iMn4nN624eZxZfsKEV3ASr9xh9Y4LdrM4D2zU4lkM0/rs:fit:456:456/extend:true/wm:1:re:0:0:0.8/wmid:ouch2/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNTM3/Lzc3NjE1NjlmLWI0/YzYtNDg2OS05Yzkw/LWUzOTExZjU3YTIy/ZC5wbmc.png"} width={50} height={50} />
                <h1>Lights, Camera, Movie Memories!</h1>
              </div>
              {wlstat[0] && wlstat[0].memories ? wlstat[0].memories.split(",").map((item,idx) => <div className="mems">
                <h1>{item}</h1>
                <button onClick={()=>{delMem(idx)}}>Delete</button></div>)
                : ""}

              <div className="inp">
                <input type="text" placeholder="Add a Memory" autoComplete="off" name="memory" value={memory} onChange={(e)=>{setMem(e.target.value)}}/>
                <button onClick={addMem}>ADD</button>
              </div>

            </div>
            : ""}
            <div class="comments">
                <div className="inputforcomments">
                    <input type="text" autoComplete="off" name="review" placeholder="Add Review" value={review} onChange={(e)=>setReview(e.target.value)}/>
                    <button onClick={sendReview}>➤</button>
                </div>
                <div className="displaycomments">
                    {reviewData ? reviewData.map((item)=> <h3>{item.Review}</h3>):""}
                </div>
                
            </div>



        </div>
      ) : (
        ""
      )}
    </div>
  );
}


