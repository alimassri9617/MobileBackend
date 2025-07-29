// models/appointment.model.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  student:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime:       { type: Date, required: true },
  intervalMinutes: { type: Number, enum: [15, 30, 60], required: true },
  endTime:         { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  appointmentReason: { type: String, required: true },
  rejectionReason:   { type: String, default: "" },  
  createdAt:         { type: Date, default: Date.now },
});

// Pre-validate hook remains the same...
appointmentSchema.pre('validate', function (next) {
  if (this.startTime && this.intervalMinutes) {
    this.endTime = new Date(this.startTime.getTime() + this.intervalMinutes * 60000);
  }
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
