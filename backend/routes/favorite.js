import express from 'express';
import { handlePostFav, handleGetFav, handleDeleteFav } from '../controllers/favorite.js'

const router = express.Router();

router.post('/', handlePostFav);
router.get('/', handleGetFav);
router.delete('/', handleDeleteFav);

export default router;