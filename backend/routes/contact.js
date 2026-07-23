import express from 'express';
import { handleContactPost } from '../controllers/contact.js'
import { validateBody } from '../middlewares/validate.js';
import { contactSchema } from "../schema/contact.schema.js"

const router = express.Router();


router.post('/', validateBody(contactSchema), handleContactPost);

export default router;
