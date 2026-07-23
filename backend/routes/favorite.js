import express from 'express';
import { handlePostFav, handleGetFav, handleDeleteFav } from '../controllers/favorite.js'
import { validateBody } from '../middlewares/validate.js';
import { favoriteSchema } from '../schema/favorite.schema.js';

const router = express.Router();

router.post('/', validateBody(favoriteSchema), handlePostFav);
router.get('/', handleGetFav);
router.delete('/:favoriteId', handleDeleteFav);

export default router;