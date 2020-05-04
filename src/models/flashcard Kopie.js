const mongoose = require("mongoose") 
const Schema = mongoose.Schema 

const flashcardsetsSchema = new Schema({
  cardQuestion: {
    type: String,
  },
  cardAnswer: {
    type: String,
  },
}, {
  timestamps: true,
})

const flashcardSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  child: [flashcardsetsSchema],
  tags: [String],
  isPrivate: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
}) 

const Flashcard = mongoose.model("Flashcard", flashcardSchema) 
const Flashcardsets = mongoose.model("Flashcardsets", flashcardsetsSchema) 

module.exports = Flashcard 
