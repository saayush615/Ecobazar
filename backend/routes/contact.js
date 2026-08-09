import express from 'express';
import { handleContactPost } from '../controllers/contact.js'
import { validateBody } from '../middlewares/validate.js';
import { contactSchema } from "../schema/contact.schema.js"
import { contactLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();


router.post('/', contactLimiter, validateBody(contactSchema), handleContactPost);

export default router;
