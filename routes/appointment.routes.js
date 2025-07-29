import express from 'express';
const router = express.Router();
import {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
  listAppointments,
  getAppointmentById
} from '../controllers/appointment.controller.js'
import protectRoute from '../middleware/protectRoute.js';
import restrictTo from '../middleware/RoleRestriction.js';


router.post('/',protectRoute, restrictTo('student','admin'), createAppointment);
router.get('/',protectRoute, listAppointments);
router.get('/:id',protectRoute, getAppointmentById);
router.patch('/:id/accept', protectRoute,restrictTo('teacher'), acceptAppointment);
router.patch('/:id/reject',protectRoute, restrictTo('teacher'), rejectAppointment);

export default router;