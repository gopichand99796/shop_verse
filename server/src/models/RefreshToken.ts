import mongoose, { Schema, model } from 'mongoose';

export interface IRefreshToken {
  token: string;
  user: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date | null;
  replacedByToken?: string | null;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true, unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date },
  replacedByToken: { type: String }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

refreshTokenSchema.index({ token: 1 });

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
