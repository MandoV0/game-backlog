import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/error";

export function errorHandler(err: Error | ApiError, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ 
            status: 'error',
            message: err.message 
        });
    }

    if (err.message.includes('not found')) {
        return res.status(404).json({ 
            status: 'error',
            message: err.message 
        });
    }

    if (err.message.includes('already exists')) {
        return res.status(409).json({ 
            status: 'error',
            message: err.message 
        });
    }

    if (err.message.includes('Invalid') || err.message.includes('required')) {
        return res.status(400).json({ 
            status: 'error',
            message: err.message 
        });
    }

    return res.status(500).json({ 
        status: 'error',
        message: "Internal Server Error" 
    });
}