const express = require('express')
const app = express()
const models = require('./models')
const mustacheExpress = require('mustache-express')
var bcrypt = require('bcryptjs')
require('dotenv').config()
const PORT = process.env.PORT_NUMBER
const session = require('express-session')

app.use(express.urlencoded())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static('views'))

app.use(session({
    secret: process.env.SESSION_ID,
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/profile', (req, res) => {
    res.render('profile')
})

app.get('/create-project', (req, res) =>{
    res.render('create-project')
})

app.post('/project-details' ,(req, res) => {
    const projectName = req.body.projectName
    const projectDescription = req.body.projectDescription
    // Keep name consistent
    const projectStatus = "Plan to do"
    const userId = req.session.username



})

app.post('/register', (req, res) => {
    const username = req.body.username.toLowerCase()
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    models.User.findAll({
        where: { username: username }
    }).then((users) => {
        const persistedUser = users.find(user => {
            return user.username == username
        })
        if (persistedUser) {
            res.render('register', { message: 'Username already exists' })
        } else {
            if (password == confirmPassword) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        let user = models.User.build({
                            username: username,
                            password: hash,
                        })
                        user.save().then(() => {
                            res.redirect('login')
                        })
                    })
                })
            } else {
                res.render('register', { message: 'Passwords do not match' })
            }
        }
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username.toLowerCase()
    const password = req.body.password
    models.User.findAll({
        where: { username: username }
    }).then((users) => {
        const persistedUser = users.find(user => {
            return user.username == username
        })
        if (persistedUser) {
            bcrypt.compare(password, persistedUser.password, function (err, result) {
                if (result) {
                    req.session.username = persistedUser.dataValues.id
                    console.log(req.session.username)
                    res.redirect('/profile')
                }
                else {
                    res.render('login', { message: 'Password do not match' })
                }
            })
        }
        else {
            res.render('login', { message: 'Username does not exist' })
        }
    })
})


app.listen(PORT, () => {
    console.log('Server is running...')
})