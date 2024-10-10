import mongoose from "mongoose";

const HealthRecordSchema = new mongoose.Schema({
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Foreign key to the Users collection
    required: true
  },
  symptoms: {
    type: [String],  // Array of symptoms
    required: true
  },
  diagnoses: {
    type: [String],  // Array of diagnoses
    required: true
  },
  treatment_plan: {
    type: [String],  // Array of treatments or actions to be taken
    required: true
  },
  // medication_history: [{
  //   medication: {
  //     type: String,
  //     required: true
  //   },
  //   dosage: {
  //     type: String,
  //     required: true
  //   },
  //   start_date: {
  //     type: Date,
  //     required: true
  //   },
  //   end_date: {
  //     type: Date,
  //     required: true
  //   }
  // }],
 doctor_notes: {
    type: [String],  // Array of notes from the doctor
    required: false
  },
  ai_health_advice: {
    type: [String],  // Array of personalized health advice from the AI chatbot
    required: false
  },
  chatbot_interaction_history: [{
    interaction_date: {
      type: Date,
      required: true
    },
    user_query: {
      type: String,   // User's query or health concern
      required: true
    },
    ai_response: {
      type: String,   // AI chatbot's response or advice
      required: true
    }
  }]

},{timestamps:true});

module.exports.HealthRecord = mongoose.model('HealthRecord', HealthRecordSchema);
