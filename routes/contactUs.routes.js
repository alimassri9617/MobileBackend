import express from 'express';
import {
  createContact,
  getAllContacts,
  getContact,
  deleteContact,
} from '../controllers/contactUs.controller.js';
import restrictTo from "../middleware/RoleRestriction.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();
router.use(protectRoute)
// Create a contact message (authenticated)
router.post('/',createContact);

router.get('/', restrictTo('admin'), getAllContacts);
router.get('/:id', restrictTo('admin'), getContact);
router.delete('/:id', restrictTo('admin'), deleteContact);

export default router;
