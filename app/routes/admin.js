import { Router } from 'express';
import { ProductController } from '../controllers';
import { ValidationMiddleware, AuthMiddleWare, ProductMiddleWare } from '../middleware';
import { productSchema } from '../validations/product';

const { authenticate } = AuthMiddleWare;
const { saveProduct, fetchAllVehicleProduct, fetchOneVehicleProduct } = ProductController;
const { checkIfProductExist, checkProductFileSize,
  checkProductFileType, uploadFile } = ProductMiddleWare;
const { validateUserInput, validateFile } = ValidationMiddleware;
const router = Router();

router.use(authenticate);
router.post('/product', validateFile, validateUserInput(productSchema), checkIfProductExist,
  checkProductFileType, checkProductFileSize, uploadFile,
  saveProduct);
router.get('/products', fetchAllVehicleProduct);
router.get('/:productId/products', fetchOneVehicleProduct);

export default router;
