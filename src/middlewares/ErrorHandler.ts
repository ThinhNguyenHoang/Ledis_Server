import BaseError from "../errors/BaseError";
import {NextFunction, Request, Response} from "express";

function logError(err: BaseError) {
    console.error(err)
}

function logErrorMiddleware(err: BaseError, req: Request, res: Response, next: NextFunction) {
    logError(err)
    next(err)
}

function returnError(err: BaseError, req: Request, res: Response, next: NextFunction) {
    res.status(err.statusCode || 500).json({
        code: err.statusCode,
        message: err.message
    })
}

function isOperationalError(error: any) {
    if (error instanceof BaseError) {
        return error.isOperational
    }
    return false
}

export {
    logError,
    logErrorMiddleware,
    returnError,
    isOperationalError
}