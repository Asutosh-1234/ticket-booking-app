import ApiError from "../utils/Api.Error.js";

const validate = (Dtoclass) => {
    return (req, res, next) => {
        const { errors, value } = Dtoclass.validate(req.body)
        if (errors) {
            return ApiError.badRequestError(res, errors.join("; "))
        }
        req.body = value
        next()
    }
}


export default validate