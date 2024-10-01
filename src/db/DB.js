import mongoose from "mongoose";

const connectDb = async ()=>{
  try{
      const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
      console.log(`MONGODB CONNECTED !! DB Host:${connectionInstance.connection.host}`);
  }catch(error){
       console.log("CONNECTION ERROR IN MONGODB",error)
       process.exit(1);
  }
}


// import mongoose from "mongoose";

// const connectDb = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
//     console.log(`\nMongoDb connected !! DB Host: ${connectionInstance.connection.host}`);
//   } catch (error) {
//     console.log("Connection error in MongoDB", error);
//     process.exit(1);
//   }
// };

export default connectDb;