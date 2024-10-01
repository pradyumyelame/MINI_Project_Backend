import mongoose from "mongoose";

const SymptomCheckerSchema = new mongoose.Schema({
  symptom_id: {
    type: mongoose.Schema.Types.ObjectId,  // Automatically generated unique identifier
    index: true,
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Foreign key referencing the Users (Patients)
    required: true
  },
  user_input: {
    type: [String],  // Array of symptoms entered by the user
    required: true
  },
  suggested_diagnosis: {
    type: [String],  // Array of possible diagnoses suggested by the AI model
    required: true
  },
  severity_score: {
    type: Number,  // Severity score based on AI analysis (e.g., scale 1-10)
    required: true
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

module.exports.SymptomChecker = mongoose.model('SymptomChecker', SymptomCheckerSchema);
