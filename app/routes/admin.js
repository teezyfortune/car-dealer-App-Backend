import { Router } from 'express';
import { ProductController } from '../controllers';
import { ValidationMiddleware, AuthMiddleWare, ProductMiddleWare } from '../middleware';
import { productSchema, updateProductSchema } from '../validations/product';

const { authenticate } = AuthMiddleWare;
const { saveProduct, fetchAllVehicleProduct, fetchOneVehicleProduct,
  removeProduct, updateProduct } = ProductController;
const { checkIfProductExist, checkProductFileSize, checkIfProductExistById,
  checkProductFileType, uploadFile } = ProductMiddleWare;
const { validateUserInput, validateFile } = ValidationMiddleware;
const router = Router();

router.use(authenticate);
router.post('/product', validateFile, validateUserInput(productSchema), checkIfProductExist,
  checkProductFileType, checkProductFileSize, uploadFile,
  saveProduct);

router.patch('/:productId/product', validateUserInput(updateProductSchema), checkIfProductExistById,
  checkProductFileType, checkProductFileSize, uploadFile,
  updateProduct);

router.delete('/:productId/product', removeProduct);
router.get('/products', fetchAllVehicleProduct);
router.get('/:productId/product', fetchOneVehicleProduct);

export default router;
