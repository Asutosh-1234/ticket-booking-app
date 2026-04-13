import Joi from "joi";
import BaseDto from "../base.dto.js";

class LoginDto extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().email().lowercase().required("Email is required"),
        password: Joi.string().required("Password is required"),
    });
}

export default LoginDto;
