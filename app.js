const express = require('express')
const app = express()
const models = require('./models')
const mustacheExpress = require('mustache-express')
var bcrypt = require('bcryptjs')
require('dotenv').config()
const PORT = process.env.PORT_NUMBER
const session = require('express-session')
//const project = require('./models/project')
const profileRouter = require('./routes/profile')

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
app.use('/profile', authenticate, profileRouter)

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
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
                    res.render('login', { message: 'Password does not match' })
                }
            })
        }
        else {
            res.render('login', { message: 'Username does not exist' })
        }
    })
})


app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
})

function authenticate(req, res, next) {
    if (req.session) {
        if (req.session.username) {
            next()
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }

}



app.listen(PORT, () => {
    console.log('Server is running...')
})