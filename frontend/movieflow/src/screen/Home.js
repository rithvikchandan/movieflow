import React from 'react'
import Nav from "../components/Nav";
import Feature from '../components/Feature';

const data = [{
    "title": "Personalized AI Movie Recommendations",
    "description": "Discover movies tailored just for you! Our AI analyzes your viewing habits and preferences to suggest the perfect movie—every time.",
    "why_awesome": "No more endless scrolling—MovieFlow understands your unique taste!"
  },
  {
    "title": "Find Movies Across Platforms",
    "description": "Know exactly where to watch your favorite movies. See availability on Netflix, Prime Video, Disney+, and more in one place.",
    "why_awesome": "Saves time and effort—no need to search multiple platforms manually."
  },
  {
    "title": "Smart Watchlist with Alerts",
    "description": "Keep track of movies you want to watch and get notified when they’re available on your favorite streaming platforms or when new releases hit.",
    "why_awesome": "Never miss a release or forget a movie you’ve been dying to see!"
  }
]
export default function Home() {
  return (
    <div>
      <Nav />
      <div className="bottom">
        <h1>Movies Personalized Just for You!</h1>
      </div>
      <div className="Intro">
        <h2>Welcome to MovieFlow</h2>
        <p>
          Your ultimate destination for discovering the perfect movie every
          time. With AI-powered recommendations, mood-based picks, and
          personalized suggestions, MovieFlow ensures you never waste a moment
          searching. Plan movie nights, track your favorites, and stay updated
          with upcoming releases — all in one seamless experience. Dive into the
          world of endless entertainment today!
        </p>
        <h1>Discover, Track, and Watch: Your Ultimate Movie Companion</h1>
        <div className='features'>
        <Feature title={data[0].title} desc={data[0].description} why={data[0].why_awesome}/>
        <Feature title={data[1].title} desc={data[1].description} why={data[1].why_awesome}/>
        <Feature title={data[2].title} desc={data[2].description} why={data[2].why_awesome}/>
        </div>
        
      </div>
      <div className="footer">
        <p>&copy; 2024 MovieFlow. All rights reserved. | Powered by TMDb.</p>
      </div>
    </div>
  )
}
