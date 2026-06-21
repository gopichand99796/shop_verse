import { NextFunction, Request, Response } from 'express';

interface ErrorResponse {
  status?: number;
  message: string;
  errors?: unknown;
}

export default function errorHandler(err: ErrorResponse, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal Server Error', errors: err.errors || [] });
}
