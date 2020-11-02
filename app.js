const express = require('express')
const app = express()
const models = require('./models')
const mustacheExpress = require('mustache-express')
var bcrypt = require('bcryptjs')
require('dotenv').config()
const PORT = process.env.PORT_NUMBER

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req,res) => {
    res.render('register')
})


app.post('/register', (req,res) => {
    const username = req.body.username
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    if (password == confirmPassword) {

    }else{
        res.render('register', {message, 'Passwords do not match'})
    }

})

app.post('/login', (req,res) => {

})


app.use(express.urlencoded())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine','mustache')

app.listen(PORT, () => {
    console.log('Server is running...')
})