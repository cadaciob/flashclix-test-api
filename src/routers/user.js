const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.get("/current", async (req, res) => {
    const user = await User.find({})
    res.send(user)
  })
  

// for testing purpose only
router.get('/testuser', (req, res) => {
    res.send('From a new file ./routers/user.js')
})

router.get('/users/me', auth, async (req, res) => {
    console.log(req.token)
    res.send(req.user)
})

// router.post('/users', async (req, res) => {
//     const user = new User(req.body)

//     function getAge(birthday) {
//         var today = new Date()
//         var thisYear = 0
//         if (today.getMonth() < birthday.getMonth()) {
//             thisYear = 1
//         } else if ((today.getMonth() === birthday.getMonth()) && today.getDate() < birthday.getDate()) {
//             thisYear = 1
//         }
//         var age = today.getFullYear() - birthday.getFullYear() - thisYear
//         return age
//     }

//     try {
//         if (isNaN(user.birthdate)) {
//             return res.send({
//                 error: 'You have to enter your birthdate! year-month-day!'
//             })
//         }
//         user.age = getAge(user.birthdate)
//         await user.save()
//         res.status(201).send(user)
//         //console.log(user.birthdate)
//         //console.log(age(user.birthdate) + 1)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

//signup
router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        //console.log(new Date(req.body.birthdate).toString())
        user.birthdate = new Date(req.body.birthdate)

        await user.save()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

//signin
router.post('/users/signin', async (req, res) => {
    try {
        const user = await User.findByUserEmailPassword(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
        console.log(token)
    } catch (error) {
        res.status(400).send()
    }
})

//signout
router.post('/users/signout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            console.log('req.token:' + req.token)
            return token.token !== req.token
        })
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/signoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//read / fetch all users
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

// read / fetch users by its id
router.get('/users/:id', async (req, res) => {
    const userId = req.params.id

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

//update users 
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password', 'birthdate']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) { 
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        // shorthand syntax
        updates.forEach((update) => req.user[update] = req.body[update])
        
        req.user.birthdate = new Date(req.body.birthdate)

        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()

        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router