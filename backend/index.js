import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import router from "./routes/uservalidation.js";
import router2 from "./routes/two.js";

const supabaseUrl = process.env.LINK;
const supabaseKey = process.env.KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const app = express();
const port = 3144;
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://movieflow-l6bt.vercel.app/");
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
