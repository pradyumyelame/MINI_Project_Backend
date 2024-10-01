const ChatbotInteractionSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    interaction_date: {
      type: Date,
      default: Date.now
    },
    user_query: {
      type: String,
      required: true
    },
    ai_response: {
      type: String,
      required: true
    }
  });
  