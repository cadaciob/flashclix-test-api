const mongoose = require('mongoose')
const flashcardset = require('./flashcardset')

const Schema = mongoose.Schema

const flashcardSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  flashcardset: [{
    cardQuestion: {
      type: String,
    },
    cardAnswer: {
      type: String,
    }
  }],
  tags: [String],
  isPrivate: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

const Flashcard = mongoose.model('Flashcard', flashcardSchema)

module.exports = Flashcard
