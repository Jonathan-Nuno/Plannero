const express = require('express')
const app = express()
const models = require('./models')
const mustacheExpress = require('mustache-express')
var bcrypt = require('bcryptjs')
require('dotenv').config()
const PORT = process.env.PORT || 8080
const session = require('express-session')
const profileRouter = require('./routes/profile')
const Str = require('@supercharge/strings')



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
    res.redirect('/profile')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/about-us', (req, res) => {
    res.render('about-us')
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
            // popups.alert({
            //     content: 'Username already exists'
            // })

            res.render('register', { message: 0 })
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
                res.render('register', { message: 1 })
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
                    req.session.name = req.body.username
                    req.session.username = persistedUser.dataValues.id
                    res.redirect('/profile')
                }
                else {
                    res.render('login', { message: 0 })
                }
            })
        }
        else {
            res.render('login', { message: 1 })
        }
    })
})

app.get('/login-guest', (req, res) => {
    const username = Str.random(25)
    models.User.findAll({
        where: { username: username }
    }).then((users) => {
        const persistedUser = users.find(user => {
            return user.username == username
        })
        if (persistedUser) {
                    res.redirect('/login-guest')
                }
        else {
            let user = models.User.build({
                username: username
            })
            user.save().then(() => {
                req.session.username = user.id
                req.session.guest = true
                console.log(req.session.username)
                res.redirect('/profile')
            })
        }
    })
})


app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login')
    })
})

function authenticate(req, res, next) {
    if (req.session) {
        if (req.session.username) {
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }

}



app.listen(PORT, () => {
    console.log('Server is running...')
})