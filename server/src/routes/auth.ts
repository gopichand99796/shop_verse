import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { Types } from 'mongoose';

const router = Router();

router.post('/register', async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
		const exists = await User.findOne({ email });
		if (exists) return res.status(409).json({ message: 'Email already registered' });
		const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 12));
		const user = await User.create({ name, email, passwordHash: hash, role: 'customer' });
		return res.status(201).json({ id: user._id, email: user.email, name: user.name });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

		const accessToken = signAccessToken(user._id, (user.role as any) || 'customer');
		const refreshToken = signRefreshToken(user._id);
		const decoded = verifyRefreshToken(refreshToken);
		const expiresAt = new Date((decoded.exp || 0) * 1000);
		await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt });

		return res.json({ accessToken, refreshToken });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
});

router.post('/refresh', async (req, res) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) return res.status(400).json({ message: 'Missing token' });
		// verify signature
		let payload;
		try {
			payload = verifyRefreshToken(refreshToken);
		} catch (e) {
			return res.status(401).json({ message: 'Invalid token' });
		}
		const stored = await RefreshToken.findOne({ token: refreshToken });
		if (!stored) return res.status(401).json({ message: 'Token not found' });
		if (stored.revokedAt) return res.status(401).json({ message: 'Token revoked' });
		if (stored.expiresAt < new Date()) return res.status(401).json({ message: 'Token expired' });

		// rotate
		stored.revokedAt = new Date();
		const newRefresh = signRefreshToken(stored.user);
		const decoded = verifyRefreshToken(newRefresh);
		stored.replacedByToken = newRefresh;
		await stored.save();
		const newRefreshDoc = await RefreshToken.create({ token: newRefresh, user: stored.user, expiresAt: new Date((decoded.exp || 0) * 1000) });

		const accessToken = signAccessToken(stored.user, 'customer');
		return res.json({ accessToken, refreshToken: newRefresh });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
});

router.post('/logout', async (req, res) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) return res.status(400).json({ message: 'Missing token' });
		await RefreshToken.deleteOne({ token: refreshToken });
		return res.json({ success: true });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
});

export default router;
