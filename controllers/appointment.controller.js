
import Appointment from '../models/appointment.model.js';

import notificationService from "../utils/NotificationService.js";

export const createAppointment = async (req, res, next) => {
  try {
    const { student, teacher, startTime, intervalMinutes, appointmentReason } = req.body;

    if (!appointmentReason) {
      return res.status(400).json({ message: 'Appointment reason is required.' });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + intervalMinutes * 60000);

    if (start < new Date()) {
      return res.status(400).json({ message: 'Cannot create an appointment in the past.' });
    }

    const conflict = await Appointment.findOne({
      teacher,
      status: { $in: ['pending', 'accepted'] },
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (conflict) {
      return res.status(400).json({ message: 'An appointment overlaps with this time slot.' });
    }

    const newAppt = await Appointment.create({
      student,
      teacher,
      startTime: start,
      intervalMinutes,
      appointmentReason,
    });

    // Notify the teacher
    await notificationService.notifyUsers({
      recipients: [teacher],
      sender: student,
      type: "appointment",
      message: "New appointment request received.",
      data: {
        appointmentId: newAppt._id,
        appointmentReason,
        startTime: start,
        type: "Appointments",
      },
    });

    return res.status(201).json(newAppt);
  } catch (err) {
    next(err);
  }
};



export const listAppointments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const filter = {};

    if (role === 'student') {
      filter.student = userId;
    } else if (role === 'teacher') {
      filter.teacher = userId;
    } else if (role === 'admin') {
      // no additional filter
    } else {
      return res.status(403).json({ message: 'Unauthorized access.' });
    }

    const appts = await Appointment.find(filter)
      .populate('student', 'firstName lastName profilePic')
      .populate('teacher', 'firstName lastName profilePic')
      .sort({ startTime: 1 });

    return res.json(appts);
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate('student', 'firstName lastName profilePic')
      .populate('teacher', 'firstName lastName profilePic');

    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    const userId = req.user._id.toString();
    const role = req.user.role;
    const isStudent = appt.student._id.toString() === userId;
    const isTeacher = appt.teacher._id.toString() === userId;

    if (!(role === 'admin' || isStudent || isTeacher)) {
      return res.status(403).json({ message: 'Unauthorized to view this appointment.' });
    }

    return res.json(appt);
  } catch (err) {
    next(err);
  }
};

export const acceptAppointment = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appt.status !== 'pending') {
      return res.status(400).json({
        message: `Cannot accept an appointment in '${appt.status}' status.`
      });
    }

    appt.status = 'accepted';
    await appt.save();

    // Notify the student
    await notificationService.notifyUsers({
      recipients: [appt.student],
      sender: appt.teacher,
      type: "appointment",
      message: "Your appointment has been accepted.",
      data: {
        appointmentId: appt._id,
        startTime: appt.startTime,
      },
    });

    return res.json(appt);
  } catch (err) {
    next(err);
  }
};



export const rejectAppointment = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appt.status !== 'pending') {
      return res.status(400).json({
        message: `Cannot reject an appointment in '${appt.status}' status.`
      });
    }

    appt.status = 'rejected';
    if (req.body.rejectionReason) {
      appt.rejectionReason = req.body.rejectionReason;
    }
    await appt.save();

    // Notify the student
    await notificationService.notifyUsers({
      recipients: [appt.student],
      sender: appt.teacher,
      type: "appointment",
      message: "Your appointment has been rejected.",
      data: {
        appointmentId: appt._id,
        rejectionReason: req.body.rejectionReason || "",
      },
    });

    return res.json(appt);
  } catch (err) {
    next(err);
  }
};
