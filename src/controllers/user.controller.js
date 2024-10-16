import asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { User} from "../models/user.models.js"
import ApiResponse  from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password } = req.body

    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
       name,
        email, 
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password "
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    // console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

// const getUserProfile = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     const user = await User.findById(userId).select('fullName email phone address gender birthday avatar');

//     if (!user) {
//         throw new ApiError(404, 'User not found');
//     }

//     return res.status(200).json(new ApiResponse(200, user, 'User profile fetched successfully'));
// });

// module.exports = {
//     getUserProfile,
// };

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}




















// import { User } from "../models/user.models.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import ApiError from "../utils/ApiError.js";
// import bcrypt from "bcrypt"; // Make sure to import bcrypt if it's used for hashing passwords.

// // Utility function for generating refresh token
// const generateRefreshToken = async (userId) => {
//     try {
//         const user = await User.findById(userId);
//         const refreshToken = user.generateRefreshToken(); // Ensure this method is defined in your User model.

//         user.refreshToken = refreshToken; // Store the refresh token in the user document.
//         await user.save({ validateBeforeSave: false }); // Save without validation for efficiency.

//         return refreshToken;
//     } catch (error) {
//         throw new ApiError(500, "Something went wrong while generating refresh token");
//     }
// };

// // User Registration
// const registerUser = asyncHandler(async (req, res) => {
//     let { name, username, email, password, role, gender, date_of_birth, address, phone_number } = req.body;

//     // Validate required fields
//     if ([name, username, email, password, role, gender, date_of_birth, address, phone_number]
//         .some((field) => !field || (typeof field === 'string' && field.trim() === ""))
//     ) {
//         throw new ApiError(400, "All fields are required");
//     }

//     // Trim fields
//     [name, username, email, password, role, gender, date_of_birth, address, phone_number] =
//         [name, username, email, password, role, gender, date_of_birth, address, phone_number]
//             .map(field => typeof field === 'string' ? field.trim() : field); // Ensure only strings are trimmed.

//     // Check if user already exists
//     const existedUser = await User.findOne({ $or: [{ email }, { phone_number }] });
//     if (existedUser) {
//         throw new ApiError(409, "User with phone number or email already exists");
//     }

//     // Hash the password before saving the user
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const createdUser = await User.create({
//         name, username, email, password, role, gender, date_of_birth, address, phone_number
//     });

//     const loggedInUser = await User.findById(createdUser._id).select("-password"); // Exclude password from the response.

//     // Return successful registration response
//     return res.status(200).json({
//         success: true,
//         message: "Registered successfully",
//         user: loggedInUser
//     });
// });

// // User Login
// const loginUser = asyncHandler(async (req, res) =>{
//     // req body -> data
//     // username or email
//     //find the user
//     //password check
//     //access and referesh token
//     //send cookie

//     const {email, username, password} = req.body
    

//     if (!username && !email) {
//         throw new ApiError(400, "username or email is required")
//     }
    
//     // Here is an alternative of above code based on logic discussed in video:
//     // if (!(username || email)) {
//     //     throw new ApiError(400, "username or email is required")
        
//     // }

//     const user = await User.findOne({
//         $or: [{username}, {email}]
//     })

//     if (!user) {
//         throw new ApiError(404, "User does not exist")
//     }

//    const isPasswordValid = await user.isPasswordCorrect(password)
    
//    if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid user credentials")
//     }

//    const {refreshToken} = await generateRefreshToken(user._id)

//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//     const options = {
//         httpOnly: true,
//         secure: true
//     }
//     return res
//     .status(200)
//     .cookie("refreshToken", refreshToken, options)
//     .json({
//         success: true,
//         message: "Logged in successfully",
//         user: loggedInUser
//     })

// })


// // User Logout
// const logoutUser = asyncHandler(async (req, res) => {
//     await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

//     const options = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production', // Secure in production
//     };

//     // Clear the refresh token cookie
//     return res
//         .status(200)
//         .clearCookie("refreshToken", options)
//         .json({
//             success: true,
//             message: "Logged out successfully"
//         });
// });

// export { registerUser, loginUser, logoutUser };
