import mongoose  from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const UserSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        unique: true
    },
    username:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password:{
      type:String,
      requireed:[true,"Password is required"],
      unique: true,
      lowercase: true
    },
    fullname:{
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
    role:{
        type: String,
        enum: ["Patient","Doctor","Admin"],
        default:"Patient",
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
      },
    date_of_birth: {
        type: Date,
        required: true
      },
    address: {
        street: {
          type: String,
          required: true
        },
        city: {
          type: String,
          required: true
        },
        state: {
          type: String,
          required: true
        },
        country: {
          type: String,
          required: true
        }
      },
      phone_number: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please provide a valid phone number']
      },
      health_records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthRecord'  // References the HealthRecord model
      }],
      emergency_contacts: [{
        name: {
          type: String,
          required: true
        },
        relationship: {
          type: String,
          required: true
        },
        phone_number: {
          type: String,
          required: true,
          match: [/^\d{10}$/, 'Please provide a valid phone number']
        }
      }],
      
    },{timestamps:true});

  UserSchema.pre("save",async function(next) {
     if(!this.isModified("password")) return next();

     this.password = bcrypt.hash(this.password,10)
     next()
  })


    UserSchema.methods.isPasswordCorrect = async function
    (password) {
      return await bcrypt.compare(password,this.password)
    }

    userSchema.methods.generateRefreshToken = function () {
      return jwt.sign(
        {
          _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
      );
    };
    
   

    export const User = mongoose.model('User', UserSchema);