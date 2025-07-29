import ContactUs from '../models/contactUs.model.js';
import mongoose from 'mongoose'; // Import mongoose to check for specific error types

// Create a new contact message (authenticated)
export const createContact = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required: You must be logged in to submit a message.'
      });
    }

    const { title, description, category } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ status: 'fail', message: 'A title is required for your contact message.' });
    }
    if (title.length > 100) {
      return res.status(400).json({ status: 'fail', message: 'Title must be at most 100 characters long.' });
    }
    if (!description) {
      return res.status(400).json({ status: 'fail', message: 'Please provide a description for your message.' });
    }
    if (description.length > 2000) {
      return res.status(400).json({ status: 'fail', message: 'Description cannot exceed 2000 characters.' });
    }
    const validCategories = ['bug', 'feedback and suggestions', 'feature request', 'help', 'other'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ status: 'fail', message: `Invalid category. Category must be one of: ${validCategories.join(', ')}.` });
    }

    const newMessage = await ContactUs.create({
      title,
      description,
      category,
      user: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      message: 'Your contact message has been successfully submitted!',
      data: { contact: newMessage }
    });
  } catch (err) {
    // Check for Mongoose validation errors
    if (err instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        status: 'fail',
        message: `Validation failed: ${errors.join('. ')}`
      });
    }
    // Generic error for other unexpected issues
    console.error('Error creating contact message:', err); // Log the full error for debugging
    next(err); // Pass to global error handler if one exists
  }
};

// Get all contact messages (admin only)
export const getAllContacts = async (req, res, next) => {
  try {
    const messages = await ContactUs.find()
      .populate({ path: 'user', select: 'firstName lastName profilePic email' })
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: { messages }
    });
  } catch (err) {
    console.error('Error fetching all contact messages:', err);
    // Provide a more user-friendly message for fetching errors
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve contact messages. Please try again later.'
    });
  }
};

// Get a single contact message (admin only)
export const getContact = async (req, res, next) => {
  try {
    const message = await ContactUs.findById(req.params.id)
      .populate({ path: 'user', select: 'firstName lastName profilePic email' });

    if (!message) {
      return res.status(404).json({ status: 'fail', message: 'No contact message found with that ID.' });
    }

    res.status(200).json({ status: 'success', data: { message } });
  } catch (err) {
    // Handle CastError for invalid Mongoose IDs
    if (err instanceof mongoose.CastError && err.path === '_id') {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid message ID: ${req.params.id}. Please provide a valid ID.`
      });
    }
    console.error('Error fetching single contact message:', err);
    // Generic error for other unexpected issues
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve the contact message. Please try again later.'
    });
  }
};

// Delete a contact message (admin only)
export const deleteContact = async (req, res, next) => {
  try {
    const message = await ContactUs.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ status: 'fail', message: 'No contact message found with that ID to delete.' });
    }

    res.status(204).json({ status: 'success', data: null }); // 204 No Content for successful deletion
  } catch (err) {
    // Handle CastError for invalid Mongoose IDs
    if (err instanceof mongoose.CastError && err.path === '_id') {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid message ID: ${req.params.id}. Please provide a valid ID to delete.`
      });
    }
    console.error('Error deleting contact message:', err);
    // Generic error for other unexpected issues
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete the contact message. Please try again later.'
    });
  }
};

