import express from 'express';
import { handleContactPost } from '../controllers/contact.js'

const router = express.Router();

router.post('/', handleContactPost);

export default router;
