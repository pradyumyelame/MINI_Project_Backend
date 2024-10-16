import mongoose  from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    password:{
      type:String,
      required:[true,"Password is required"],
      unique: true,
     
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        lowercase: true
    },
    // role:{
    //     type: String,
    //     enum: ["Patient","Doctor","Admin"],
    //     default:"Patient",
    //     // required: true
    // },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        // required: true
      },
    date_of_birth: {
        type: Date,
        // required: true
      },
    address: {
        street: {
          type: String,
          // required: true
        },
        city: {
          type: String,
          // required: true
        },
        state: {
          type: String,
          // required: true
        },
        country: {
          type: String,
          // required: true
        }
      },
      phone_number: {
        type: String,
        // required: true,
        match: [/^\d{10}$/, 'Please provide a valid phone number']
      },
      health_records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthRecord'  // References the HealthRecord model
      }],
      // emergency_contacts: [{
      //   name: {
      //     type: String,
      //     required: true
      //   },
      //   relationship: {
      //     type: String,
      //     required: true
      //   },
      //   phone_number: {
      //     type: String,
      //     required: true,
      //     match: [/^\d{10}$/, 'Please provide a valid phone number']
      //   }
      // }],
      refreshToken: {
        type: String,
        required: false
      }
      
    },{timestamps:true});


    userSchema.pre("save", async function (next) {
      if(!this.isModified("password")) return next();
  
      this.password = await bcrypt.hash(this.password, 10)
      next()
  })
  
  userSchema.methods.isPasswordCorrect = async function(password){
      return await bcrypt.compare(password, this.password)
  }
  
  userSchema.methods.generateAccessToken = function(){
      return jwt.sign(
          {
              _id: this._id,
              email: this.email,
              username: this.username,
              name: this.name
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
              expiresIn: process.env.ACCESS_TOKEN_EXPIRY
          }
      )
  }
  userSchema.methods.generateRefreshToken = function(){
      return jwt.sign(
          {
              _id: this._id,
              
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
              expiresIn: process.env.REFRESH_TOKEN_EXPIRY
          }
      )
  }
  
  export const User = mongoose.model("User", userSchema)



//     UserSchema.pre("save",async function(next) {
//    if(!this.isModified("password")) return next();

//    this.password = await bcrypt.hash(this.password, 10);
//    next();
// });

// UserSchema.methods.isPasswordCorrect = async function(password) {
//     return await bcrypt.compare(password, this.password);
// };

// // Use "UserSchema" instead of "userSchema" here
// UserSchema.methods.generateRefreshToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );
// };

// export const User = mongoose.model('User', UserSchema);
