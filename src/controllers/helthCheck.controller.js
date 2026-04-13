import ApiResponse from "../utils/Api.Responce.js";
import ApiError from "../utils/Api.Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* 

@params {}
@description Health Check
@route GET /api/healthCheck
@access public
@returns {}
@success 200

*/

export const helthCheck = asyncHandler(async (_,res)=>{
    return ApiResponse.ok(res,"Everything is Ok",{});
})

