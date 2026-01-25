import Contact from "../models/contact.js";
import { createValidationError } from "../utils/ErrorFactory.js";

async function handleContactPost(req,res,next) {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return next(createValidationError('All fields are required')); 
        }

        const contact = await Contact.create({ name: name, email: email, subject: subject, message: message });
        return res.status(201).json({
            success: true,
            message: 'Message send successfully',
            data: {
                id: contact._id,
                name: contact.name
            }
        })
    } catch (error) {
        next(error);
    }
}
export {handleContactPost};