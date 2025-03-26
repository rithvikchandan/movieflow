import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import router from "./routes/uservalidation.js";
import router2 from "./routes/two.js";

const supabaseUrl = "https://ybnkyixugojfqjlssrvi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlibmt5aXh1Z29qZnFqbHNzcnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODQ5NjMsImV4cCI6MjA0NzI2MDk2M30._mqawcOHTawwkQFiPn_l4YtU3CsykFvhB4JwdxV1dCk";
const supabase = createClient(supabaseUrl, supabaseKey);
const app = express();
const port = 3144;
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});



app.use("/api/",router);
app.use("/api/",router2);
app.get("/", (req, res) => {
  res.send("<h1>Hello,I am Server</h1>");
});


app.listen(port, () => {
  console.log("Server Running on port " + port);
});
