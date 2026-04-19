class ApiError extends Error {
    statusCode;
    isOperational;
    
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    static unauthenticatedError(message = "You are not authenticated") {
        return new ApiError(message, 401);
    }

    static unauthorizedError(message = "You are not authorized") {
        return new ApiError(message, 403);
    }

    static notFoundError(message = "Resource not found") {
        return new ApiError(message, 404);
    }

    static badRequestError(message = "Bad request") {
        return new ApiError(message, 400);
    }

    static serverError(message = "Internal server error") {
        return new ApiError(message, 500);
    }

    static conflictError(message = "Conflict Occurs") {
        return new ApiError(message, 409);
    }
}

export default ApiError;