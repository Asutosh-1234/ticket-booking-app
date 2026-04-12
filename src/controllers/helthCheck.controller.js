import ApiResponse from "../utils/Api.Responce.js";
import ApiError from "../utils/Api.Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const helthCheck = asyncHandler(async (_,res)=>{
    return ApiResponse.ok(res,"Everything is Ok",{});
})

