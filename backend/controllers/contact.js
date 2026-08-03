import Contact from "../models/contact.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createValidationError } from "../utils/ErrorFactory.js";

const handleContactPost = asyncHandler(async (req,res,next) => {
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
})

export {handleContactPost};
