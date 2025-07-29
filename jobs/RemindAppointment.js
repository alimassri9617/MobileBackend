import  Appointment  from "../models/appointment.model.js";
import notificationService from "../utils/NotificationService.js"

const SYSTEM_SENDER_ID = process.env.SYSTEM_SENDER_ID;

export const sendAppointmentReminders = async () => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const appointments = await Appointment.find({
    status: "accepted",
    startTime: {
      $gte: oneHourLater,
      $lt: new Date(oneHourLater.getTime() + 60 * 1000) // window of 1 min
    }
  });

  for (const appt of appointments) {
    const message = "Reminder: You have an appointment in 1 hour.";
    const data = {
      appointmentId: appt._id,
      startTime: appt.startTime,
    };

    await notificationService.notifyUsers({
      recipients: [appt.student, appt.teacher],
      sender: SYSTEM_SENDER_ID,
      type: "reminder",
      message,
      data,
    });
  }
};