import { Router } from 'express';
import authRoute from './auth';
import adminRoute from './admin';
import genericRoute from './generic';

const router = Router();

router.use('/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/product', genericRoute);

export default router;
