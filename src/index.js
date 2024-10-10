import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./db/DB.js";

dotenv.config({
  path:'./env'
})



connectDb();

app.listen(process.env.PORT || 2000, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

