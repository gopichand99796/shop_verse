import { Router } from 'express';
import { addAddress, listAddresses } from '../controllers/addressController';
import { requireAuth } from '../middleware/auth';
import mongoSanitize from '../middleware/sanitize';
import { addressSchema } from '../validators/address';

const router = Router();

router.post('/', requireAuth, mongoSanitize, (req, res, next) => {
	try { addressSchema.parse(req.body); } catch (e) { return res.status(400).json({ message: 'Validation failed', errors: e }); }
	return addAddress(req, res, next);
});

router.get('/', requireAuth, listAddresses);

export default router;
