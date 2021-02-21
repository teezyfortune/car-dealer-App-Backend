import { Router } from 'express';
import { ProductController } from '../controllers';

const { fetchVehicleByName } = ProductController;

const router = Router();

router.get('/search', fetchVehicleByName);

export default router;
