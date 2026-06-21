import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const accessSecretRaw = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const refreshSecretRaw = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const accessExpires = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const refreshExpires = process.env.REFRESH_TOKEN_EXPIRES || '7d';

const accessSecret = accessSecretRaw as unknown as jwt.Secret;
const refreshSecret = refreshSecretRaw as unknown as jwt.Secret;

export function signAccessToken(userId: Types.ObjectId | string, role: string) {
  return jwt.sign({ sub: String(userId), role } as jwt.JwtPayload, accessSecret, { expiresIn: accessExpires } as jwt.SignOptions);
}

export function signRefreshToken(userId: Types.ObjectId | string) {
  return jwt.sign({ sub: String(userId) } as jwt.JwtPayload, refreshSecret, { expiresIn: refreshExpires } as jwt.SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret) as { sub: string; role?: string; iat?: number; exp?: number };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret) as { sub: string; iat?: number; exp?: number };
}
