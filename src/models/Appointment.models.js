import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,  // Automatically generated unique identifier
    index: true,
    unique: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Foreign key referencing Users (Patients)
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Foreign key referencing Users (Doctors)
    required: true
  },
  appointment_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Canceled'],
    default: 'Scheduled',
    required: true
  },
  notes: {
    type: String,  // Optional notes related to the appointment
    required: false
  },
  video_call_link: {
    type: String,  // URL link for the video call session
    required: true
  },
  call_start_time: {
    type: Date,  // When the video call started
    required: false
  },
  call_end_time: {
    type: Date,  // When the video call ended
    required: false
  },
  session_notes: {
    type: String,  // Notes about what was discussed in the telemedicine session
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
