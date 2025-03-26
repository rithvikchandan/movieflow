import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";



const supabaseUrl = process.env.LINK;
const supabaseKey = process.env.KEY;
const supabase = createClient(supabaseUrl, supabaseKey);




const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.Auth
  }
  };
router.post("/login", async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("users")
      .select("password")
      .eq("email", req.body.email); //get user password where email matches
    if(data.length===0){
        return res.send({success:false,message:"User doesnt exist"});// if user email doesnt match we directly return and show user doesnt exist
    }
    if (error) {
      throw error;
    }
    const pwdcompare = await bcrypt.compare(req.body.password, data[0].password);// it compares our text pass with actual hashed password
    if (pwdcompare) {
      // if both password matches , send success as true
      res.send({ success: true });
    } else {
      res.send({ success: false, message: "Wrong Password!" }); // sending success as false , as password is wrong
    }
  } catch (e) {
    console.log("Error logging in: ", e);
    res.send({ success: false, message: "Something went wrong" });
  }
});
async function checkUser(a){// checks whether an email exists in
    try {
      const { data, error } = await supabase.from("users").select("*").eq("email",a);
      if(data.length>0){
        return true;
      }else{
        return false;
      }
    } catch (e) {
      console.log("Error logging in: ", e);
    }
  }
router.post("/signup", async (req, res) => {
  if (req.body.password === req.body.cpassword) {
    const salt = await bcrypt.genSalt(10);
    let secpass = await bcrypt.hash(req.body.password, salt); // getting hashed password
    try {
        if(checkUser(req.body.email)===true){// if already email is used, we return saying already email exists

           return res.send({success: false,message:"Already this email exists"});
        }

        
      const { data, error } = await supabase.from("users").insert([
        {
          email: req.body.email,
          password: secpass,
        },
      ]); //inserting email and password(hashed one) into database
      
      if (error) {
        throw error;
      }
      
      res.send({ success: true });
    } catch (e) {
      console.log("Error logging in: ", e);
      res.send({ success: false, message: "Something went wrong" });
    }
  } else {
    res.send({ success: false, message: "Passwords do not match" });// if pass do not match we send message passwords do not match
  }
});


router.post("/getMovie", async(req,res)=>{
  try{
    let data={};
    const url = `https://api.themoviedb.org/3/search/movie?query=${req.body.search}&include_adult=false&language=en-US&page=1`;
    const response = await fetch(url, options);
    data = await response.json();

    if(Object.keys(data).length != 0){
      res.send({success: true,data: data});
    }else{
      res.send({success: false,message: "Sorry,Unable to Find Your Movie"});
    }
  }catch(e){
    console.log(e);
  }
})


router.post("/getSpecific", async(req,res)=>{
  try{
    let datas={};
    const url = `https://api.themoviedb.org/3/movie/${req.body.id}?append_to_response=release_dates%2Cwatch%2Fproviders&language=en-US`;
    
    const response = await fetch(url, options);
    datas = await response.json();
    let {data,error} = await supabase.from("watchlists").select("*").eq("movie_id",req.body.id).eq("email",req.body.email);
    let wlData = data;
    ({ data, error } = await supabase.from("Ratings").select("*").eq("movie_id", req.body.id));
    let avg = 0,ans=-1;
    for(let i=0;i<data.length;i++){
      if(data[i].Rating!=-1){
        avg = avg + data[i].Rating;
      }
      
      if(data[i].email===req.body.email){
        ans=data[i].Rating;
      }
    }
    
    if(error){
      throw error;
    }
    let status = -1; 
    if(ans!=-1){
      status=ans;
    }
    if(Object.keys(datas).length != 0){
      res.send({success: true,data: datas,status: status,avg: avg/data.length,length: data.length,wlData: wlData,reviews: data});
    }else{
      res.send({success: false,message: "Sorry,Unable to Find Your Movie"});
    }
  }catch(e){
    console.log(e);
  }
})


router.post("/sendRating", async(req,res)=>{
  try{
    const {data,error} = await supabase.from("Ratings").insert([
      {
        email: req.body.email,
        movie_id: req.body.id,
        Rating: req.body.rating
      }
    ])
    if(error){
      throw error;
    }
    res.send({success: true});
  }catch(e){
    console.log(e);
    res.send({success: false});
  }
})


export default router;
