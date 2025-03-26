import express from "express";
const router = express.Router();
import { createClient } from "@supabase/supabase-js";



const supabaseUrl = "https://ybnkyixugojfqjlssrvi.supabase.co";
const supabaseKey =
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlibmt5aXh1Z29qZnFqbHNzcnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODQ5NjMsImV4cCI6MjA0NzI2MDk2M30._mqawcOHTawwkQFiPn_l4YtU3CsykFvhB4JwdxV1dCk";
const supabase = createClient(supabaseUrl, supabaseKey);
const options = {
     method: 'GET',
     headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTcyYWVkNzU5YTA4Yzg3NzkzM2FlMzMxYmZjZTNkMiIsIm5iZiI6MTczMTEyMzMwNS43MDUsInN1YiI6IjY3MmVkODY5OWZkZGU4YzRiODhiY2E4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gWrxgrIbl2zG3D4Xd3Ea_VTPrmW4BW5RRe4tZtu2AKg'
     }
};

router.post("/modifyWL", async (req, res) => {
     try {
          let data = "", error = "";
          if (req.body.status === true) {
               ({ data, error } = await supabase.from("watchlists").delete().eq("movie_id", req.body.id).eq("email", req.body.email));
               if (error) {
                    throw error;
               }
               res.send({ success: true });
          } else if (req.body.status === false) {

               ({ data, error } = await supabase.from("watchlists").insert([{ "movie_id": req.body.id, "email": req.body.email, "status": "Planned", "name": req.body.name, "year": req.body.year, "genre": req.body.genre, "path": req.body.path, "ott": req.body.ott, "theatre": req.body.theatre }]));
               if (error) {
                    throw error;
               }
               res.send({ success: true });
          } else {
               res.send({ success: false });
          }

     } catch (e) {
          console.log(e);
          res.send({ success: false });
     }
})

router.post("/getWLdata", async (req, res) => {
     try {
          const { data, error } = await supabase.from("watchlists").select("*").eq("email", req.body.email);
          if (error) {
               throw error;
          }
          res.send({ success: true, data: data });
     } catch (e) {
          console.log(e);
          res.send({ success: false });
     }
})


router.post("/updateStatus", async (req, res) => {
     try {
          const { data, error } = await supabase.from("watchlists").update({ "status": req.body.status == 1 ? "Watching" : req.body.status == 0 ? "Planned" : "Watched", "Day": req.body.day, "Session": req.body.sess }).eq("email", req.body.email).eq("movie_id", req.body.id);
          if (error) {
               throw error;
          }
          res.send({ success: true });
     } catch (e) {
          console.log(e);
          res.send({ success: false, message: "Unable to process" });
     }
})

const fetchMovieData = async (mvid, k, email) => {
     const url = `https://api.themoviedb.org/3/movie/${mvid}?append_to_response=watch%2Fproviders&language=en-US`;
     const response = await fetch(url, options);
     const datas = await response.json();
     if (k == 1) {
          if (new Date(datas.release_date) <= new Date()) {
               const { data, error } = await supabase.from("watchlists").update({ "theatre": true }).eq("email", email).eq("movie_id", mvid);
               if (error) {
                    throw error;
               }
          }
          return new Date(datas.release_date) <= new Date();
     } else {
          if (datas["watch/providers"] ? Object.keys(datas["watch/providers"].results).length > 0 : false) {
               const { data, error } = await supabase.from("watchlists").update({ "ott": true }).eq("email", email).eq("movie_id", mvid);
               if (error) {
                    throw error;
               }
          }
          return datas["watch/providers"] ? Object.keys(datas["watch/providers"].results).length > 0 : false;
     }
}

router.post("/getRLdata", async (req, res) => {
     try {
          const requests = req.body.arr.map(id => fetchMovieData(id, req.body.k, req.body.email));
          const moviesData = await Promise.all(requests);
          let ans = [];
          moviesData.forEach(movie => {
               ans.push(movie);
          });
          res.send({ success: true, arr: ans })
     } catch (e) {
          console.log(e);
     }
});


router.post("/addMemory", async (req, res) => {
     try {
          const { data, error } = await supabase.from("watchlists").select("memories").eq("email", req.body.email).eq("movie_id", req.body.id);
          if (error) {
               throw error;
          }
          if (data[0].memories == "") {
               const { data2, error2 } = await supabase.from("watchlists").update({ "memories": req.body.mem }).eq("email", req.body.email).eq("movie_id", req.body.id);
               if (error2) {
                    throw error2;
               }
               res.send({ success: true });
               return;
          }
          const arr = data[0].memories.split(",");
          arr.push(req.body.mem);
          const { data2, error2 } = await supabase.from("watchlists").update({ "memories": arr.join(",") }).eq("email", req.body.email).eq("movie_id", req.body.id);
          if (error2) {
               throw error2;
          }
          res.send({ success: true });
     } catch (e) {
          console.log(e);
          res.send({ success: false });
     }
})


router.post("/delMemory", async (req, res) => {
     try {
          const { data, error } = await supabase.from("watchlists").select("memories").eq("email", req.body.email).eq("movie_id", req.body.id);
          if (error) {
               throw error;
          }
          
          const arr = data[0].memories.split(",");
          arr.splice(req.body.memid, 1);
          const { data2, error2 } = await supabase.from("watchlists").update({ "memories": arr.join(",") }).eq("email", req.body.email).eq("movie_id", req.body.id);
          if (error2) {
               throw error2;
          }
          res.send({ success: true });
     } catch (e) {
          console.log(e);
          res.send({ success: false });
     }
})

router.post("/getPlaylist", async (req, res) => {
     try {

          let { data, error } = await supabase.from("playlists").select("*");
          if (error) {
               throw error;
          }
          let pData = data
          const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_year=${new Date().getFullYear()}&sort_by=popularity.desc&with_original_language=${req.body.language}`;
          const response = await fetch(url, options);
          const datas = await response.json();

          const url2 = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&release_date.lte=${new Date().toDateString()}&sort_by=primary_release_date.desc&with_original_language=${req.body.language}`;
          const response2 = await fetch(url2, options);
          const datas2 = await response2.json();

          const url3 = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&release_date.gte=${new Date().toDateString()}&sort_by=primary_release_date.asc&with_original_language=${req.body.language}`;
          const response3 = await fetch(url3, options);
          const datas3 = await response3.json();
          

          ({ data, error } = await supabase.from("watchlists").select("*").eq("email",req.body.email))
          if (error) {
               throw error;// for prediction getting data from user database
          }
          let watchData = data;
          ({ data, error } = await supabase.from("Ratings").select("*").eq("email",req.body.email))
          if (error) {
               throw error;
          }
          let Ratingdata = data;
          let Movies = new Map();
          for(let i=0;i<watchData.length;i++){
               Movies.set(Number(watchData[i]["movie_id"]),1.0);
          }
          for (let i = 0; i < Ratingdata.length; i++) {
               Movies.set(Number(Ratingdata[i]["movie_id"]), Ratingdata[i]["Rating"]!=-1? Ratingdata[i]["Rating"]:1);
          }
          let Responses = []
          let Rates = []
          const promises = Array.from(Movies).map(async ([key, value]) => {
               const url = `https://api.themoviedb.org/3/movie/${key}?append_to_response=credits,keywords&language=en-US`;
       
               const response = await fetch(url, options);
               const datas = await response.json();
       
               Responses.push(datas);
               Rates.push(value);
          });
          await Promise.all(promises);


          const response22 = await fetch("http://127.0.0.1:5000/recommend", {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                   movies: Responses,
                   priorities: Rates
               })
          });
   
          const dataFromPython = await response22.json();
          if (response.ok && !dataFromPython.error) {
               const Rresponses = [];

               const promises = dataFromPython.recommendations.map(async (name) => {
                    const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`;   
                    const response = await fetch(url, options);
                    const data = await response.json();   
                    Rresponses.push(data.results[0]); 
               });
               await Promise.all(promises);      
                    res.send({ success: true, data: pData,trending: datas, recent: datas2,upcoming: datas3,recommendations: Rresponses});
          } else {
               res.send({ success: true, data: pData,trending: datas, recent: datas2,upcoming: datas3,recommendations: []});
          }
          
     } catch (e) {
          console.log(e);
          res.send({ success: false, message: "Unable to get Playlist" });
     }
})
router.post("/updateData", async (req, res) => {
     try {
          let { data, error } = await supabase.from("playlists").select("movie_5");
          if (error) {
               throw error;
          }
          for(let k=0;k<data.length;k++){
               const url = `https://api.themoviedb.org/3/movie/${data[k].movie_5}?language=en-US`;
               const response = await fetch(url, options);
               const datas = await response.json();
               const { data2, error2 } = await supabase.from("playlists").update({"movie_5_poster":datas.poster_path,"movie_5_name":datas.title,"movie_5_date":datas.release_date,"movie_5_genre": datas.genres.map(genre => genre.id)}).eq("movie_5",data[k].movie_5);
               if (error2) {
                    throw error2;
               }
          }
          
          
          res.send({ success: true });
     } catch(e){
          console.log(e);
          res.send({ success: false });
     }
})


router.post("/addPlaylist",async(req,res)=>{
     try{
          const arr = req.body.array;
          const {data,error} = await supabase.from("watchlists").select("movie_id");
          if(error){
               throw error;
          }
          const setA = new Set(arr);
          const setB = new Set(data.map((item)=>Number(item.movie_id)));
          const difference = ([...setA].filter(x => !setB.has(x)));
          for(let j=0;j<difference.length;j++){
               const url = `https://api.themoviedb.org/3/movie/${difference[j]}?append_to_response=watch%2Fproviders&language=en-US`;
               const response = await fetch(url, options);
               const datas = await response.json();
               const {data2,error2} = await supabase.from("watchlists").insert([{"movie_id":difference[j],"email":req.body.email,"status":"Planned","name":datas.title,"genre":JSON.stringify(datas.genres),"path":datas.poster_path,"year":datas.release_date ? new Date(datas.release_date) : null,"ott":datas["watch/providers"] ? Object.keys(datas["watch/providers"].results).length!=0:false,"theatre":datas.release_date ? new Date(datas.release_date) < new Date() : false}]);
               if(error2){
                    throw error2;
               }
          }
          res.send({success: true});
     }catch(e){
          res.send({success: false});
          console.log(e);
     }
});


router.post("/addReview", async (req, res) => {
     try {
          
          let { data, error } = await supabase.from("Ratings").select("*").eq("movie_id", req.body.id).eq("email", req.body.email);

          if (error) {
               throw error;
          }
          if(data.length!=0){
               ({data,error} = await supabase.from("Ratings").update({"Review":req.body.review}).eq("movie_id", req.body.id).eq("email", req.body.email));
          }else{
               ({data,error} = await supabase.from("Ratings").insert([{"Review":req.body.review,"Rating":-1,"email":req.body.email,"movie_id":req.body.id}]));
          }
          res.send({ success: true})
     } catch (e) {
          console.log(e);
     }
});

export default router;
