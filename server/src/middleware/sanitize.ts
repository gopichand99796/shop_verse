import { Request, Response, NextFunction } from 'express';

function sanitizeObject(obj: any) {
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj && typeof obj === 'object') {
    const out: any = {};
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.indexOf('.') !== -1) continue;
      out[key] = sanitizeObject(obj[key]);
    }
    return out;
  }
  return obj;
}

export default function mongoSanitize(req: Request, _res: Response, next: NextFunction) {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
}
