import { Response } from 'express';

export function success(res: Response, message = 'OK', data?: any) {
  return res.json({ success: true, message, data });
}

export function error(res: Response, status = 400, message = 'Error', errors?: any[]) {
  return res.status(status).json({ success: false, message, errors: errors || [] });
}
