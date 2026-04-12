class ApiError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    static unauthenticatedError(res, message = "You are not authenticated") {
        return res.status(401).json({
            success: false,
            message,
        })
    }
    static unauthorizedError(res, message = "You are not authorized") {
        return res.status(403).json({
            success: false,
            message,
        })
    }
    static notFoundError(res, message = "Resource not found") {
        return res.status(404).json({
            success: false,
            message,
        })
    }
    static badRequestError(res, message = "Bad request") {
        return res.status(400).json({
            success: false,
            message,
        })
    }
    static serverError() {
        return new ApiError("Internal server error", 500);
    }

    static conflictError(res, message = "Conflict Occurs") {
        return res.status(409).json({
            success: false,
            message: message
        })
    }
}

export default ApiError;
