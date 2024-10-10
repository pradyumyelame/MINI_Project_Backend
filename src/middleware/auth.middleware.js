import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
// import { Authority } from "../models/authorityModel.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        let user = await User.findById(decodedToken?._id).select("-password");
        if (!user) {
            user = await Authority.findById(decodedToken?._id).select("-password");
        }

        if (!user) {
            throw new ApiError(401, "User does not exist");
        }

        if (token !== user.refreshToken) {
            throw new ApiError(400, "Invalid Refresh Token or refresh token expired");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh token");
    }
});
