// * What the React Frontend can expect to receive from the backend handling the error
class BaseError extends Error {
    name: string;
    statusCode: number;
    isOperational: boolean;

    constructor(name: string, statusCode: number, description: string, isOperational: boolean) {
        // * Passing description to Error(msg:string) constructor
        super(`ERROR: ${description}`);
        // * Check if this error was created with a new key word (undefined if try to init object with ClassName() only)
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

export default BaseError;