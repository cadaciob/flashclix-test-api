const express = require('express') 
const Flashcard = require('../models/flashcard')
const auth = require('../middleware/auth') 
const router = new express.Router() 

// for testing purpose only
router.get('/testflashcard', (req, res) => {
  res.send('From a new file ./routers/flashcard.js') 
}) 

//create flashcard
router.post('/flashcards', auth, async (req, res) => {
  const flashcard = new Flashcard({
    ...req.body,
    createdBy: req.user._id
  })

  try {
    await flashcard.save() 
    res.status(201).send(flashcard) 
  } catch (error) {
    res.status(400).send(error) 
  }
})

router.get('/flashcardset', async (req, res) => {
  const _id = req.params.id 

  try {
  const flashcardset = await Flashcard.findOne( { cardQuestion: 'Q1'} )
    //console.log(flashcardset.flashcardsets)
    console.log(flashcardset.flashcardsets[0])

    //res.send(flashcardset.flashcardsets)
    res.send(flashcardset.flashcardsets)

    console.log(newSet)
  } catch (error) {
    res.status(500).send(error) 
  }
}) 

// read / fetch all flashcards
router.get('/flashcards', auth, async (req, res) => {
  try {
    //const flashcard = await Flashcard.find({ createdBy: req.user._id }) 
    
    await req.user.populate('flashcards').execPopulate()
    res.send(req.user.flashcards) 
  } catch (error) {
    res.status(500).send()
  }
}) 

// read / fetch flashcards by its id
router.get('/flashcards/:id', auth, async (req, res) => {
  const _id = req.params.id 

  try {
    const flashcard = await Flashcard.findOne({ _id, createdBy: req.user._id }) 

    if (!flashcard) {
      return res.status(404).send() 
    }

    res.send(flashcard) 
  } catch (error) {
    res.status(500).send() 
  }
})

// update flashcard by its user
router.patch('/flashcards/:id', auth, async (req, res) => {
  const flashcardId = req.params.id 

  const updates = Object.keys(req.body) 
  const allowedUpdates = [
    'title',
    'flashcardsets',
    'tags','cardQuestion',
    'cardAnswer']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid updates!'
    }) 
  }

  try {
    
    //const flashcard = await Flashcard.findById(flashcardId)
    const flashcard = await Flashcard.findOne({ _id: flashcardId, createdBy: req.user._id })

    if (!flashcard) {
      return res.status(404).send() 
    }

    updates.forEach((update) => flashcard[update] = req.body[update])
    
    await flashcard.save()

    res.send(flashcard)
  } catch (error) {
    res.status(400).send()
  }
})

// add flashcard to set
router.patch('/addflashcard/:id', auth, async (req, res) => {
  const flashcardId = req.params.id

  const {cardQuestion,cardAnswer} = req.body 
  if(!cardQuestion || !cardAnswer){
      return  res.status(422).send({ error:"Plase add all the fields" })
    }

  try {
    //const flashcard = await Flashcard.findByIdAndUpdate(_id, req.body) 
    const flashcard = await Flashcard.findOne({  _id: flashcardId, createdBy: req.user._id })
    //const flashcardSaved = flashcard.flashcardsets 
    console.log(flashcard)
    //console.log(flashcardSaved)

    if (!flashcard) {
      return res.status(404).send() 
    }

    flashcard.flashcardsets.push({
      cardQuestion: req.body.cardQuestion,
      cardAnswer: req.body.cardAnswer
    })

    await flashcard.save() 

    res.send(flashcard) 
  } catch (error) {
    res.status(400).send(error) 
  }
})

router.delete('/flashcards/:id', auth, async (req, res) => {
  const flashcardId = req.params.id 

  try {
    const flashcard = await Flashcard.findOneAndDelete({ _id: flashcardId, createdBy: req.user._id })

    if (!flashcard) {
      res.status(404).send({
        error: 'flashcard not found'
      }) 
    }

    res.send(flashcard) 
  } catch {
    res.status(500).send() 
  }
})

module.exports = router 
