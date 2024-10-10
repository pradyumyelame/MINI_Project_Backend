import mongoose,{Schema} from "mongoose";

const SymptomCheckerSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Foreign key referencing the Users (Patients)
    required: true
  },
  symptoms: {
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
  
},{timestamps:true});

module.exports.SymptomChecker = mongoose.model('SymptomChecker', SymptomCheckerSchema);
