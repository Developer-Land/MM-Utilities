import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  SuggestionMessageID: String,
  SuggestionAuthorID: String,
  SuggestionMessage: String,
  SuggestionNumber: String,
});

export default mongoose.model('suggestion', Schema);
