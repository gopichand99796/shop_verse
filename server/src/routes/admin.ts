import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import * as analytics from '../services/analyticsService';
import { success, error } from '../utils/response';

const router = Router();

router.get('/analytics/revenue', requireAuth, requireRole('admin'), async (req, res) => {
	try { const days = Number(req.query.days || 30); const data = await analytics.revenueOverTime(days); return success(res, 'Revenue', data); } catch (err) { return error(res, 500, 'Server error'); }
});

router.get('/analytics/sales-by-category', requireAuth, requireRole('admin'), async (req, res) => { try { const data = await analytics.salesByCategory(); return success(res, 'Sales by category', data); } catch (err) { return error(res, 500, 'Server error'); } });

router.get('/analytics/top-products', requireAuth, requireRole('admin'), async (req, res) => { try { const data = await analytics.topSellingProducts(Number(req.query.limit || 10)); return success(res, 'Top products', data); } catch (err) { return error(res, 500, 'Server error'); } });

router.get('/analytics/signups', requireAuth, requireRole('admin'), async (req, res) => { try { const data = await analytics.customerSignups(Number(req.query.days || 30)); return success(res, 'Signups', data); } catch (err) { return error(res, 500, 'Server error'); } });

router.get('/analytics/aov', requireAuth, requireRole('admin'), async (req, res) => { try { const data = await analytics.averageOrderValue(); return success(res, 'AOV', data); } catch (err) { return error(res, 500, 'Server error'); } });

router.get('/analytics/conversion', requireAuth, requireRole('admin'), async (req, res) => { try { const data = await analytics.conversionRate(); return success(res, 'Conversion', data); } catch (err) { return error(res, 500, 'Server error'); } });

export default router;
