import mongoose from 'mongoose';

interface suggestionInterface {
  SuggestionMessageID: string;
  SuggestionAuthorID: string;
  SuggestionMessage: string;
  SuggestionNumber: string;
}

let Schema = new mongoose.Schema<suggestionInterface>({
  SuggestionMessageID: String,
  SuggestionAuthorID: String,
  SuggestionMessage: String,
  SuggestionNumber: String,
});

let Suggestion = mongoose.model('suggestion', Schema);

export { Suggestion, suggestionInterface };
