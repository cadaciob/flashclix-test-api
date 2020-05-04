const express = require("express")
require("./db/database")

const userRouter = require("./routers/user")
const flashcardRouter = require("./routers/flashcard")

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(flashcardRouter)

app.listen(port, () => {
  console.log("Server is up on port " + port)
})
