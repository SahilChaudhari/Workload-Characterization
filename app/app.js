const express = require('express')
const bodyParsor = require('body-parser')
const session = require('express-session')
const path = require('path');
const { nextTick } = require('process');
const fs = require('fs')
const alert = require('alert') 

const PORT = 3000
const SESS_LIFETIME = 1000 * 60 * 60 * 2  // 2 hrs in ms
const SESS_NAME = "Parul"
const SESS_SECRET = 'ASDGKJASHNF'
const users = [{ id:1, name:'Parul',email:"a@gmail.com", password:"secret"},
]

const app = express()

app.use(express.static(__dirname))
app.use(bodyParsor.urlencoded({
    extended: true
}))

app.use(session({
    name : SESS_NAME,
    resave:false,
    saveUninitialized:false,
    secret : SESS_SECRET,
    cookie: {
        ttl : SESS_LIFETIME,
        sameSite : true,
        secure : false 
    }
}))

// If they are not logged in, then redirect them to login
const redirectLogin = (req,res,next) =>{
    console.log(req.session.user)
    if(!req.session.user){
        res.redirect('/')
    }else{
        next()
    }
}

const redirectHome = (req,res, next)=>{
    console.log(req.session.user)
    if(req.session.user){
        res.redirect('/home')
    }else{
        next()
    }
}

app.get('/',redirectHome,(req,res)=>{
    console.log("Got a request! Sending Login Page")
    
    const {user} = req.session
    
    res.sendFile('src/index.html',{root:"."})
})


app.get('/home',redirectLogin,(req,res)=>{
    res.sendFile('src/home.html',{root:"."})
})


app.post('/login',(req,res) => {
    console.log("Server has received the Login Request")
    console.log(req.body)
    const{email,password} = req.body
    if(email && password){
        const user = users.find(user=> 
                                email===user.email && 
                                password === user.password)
    
        if(user){
            req.session.user = user.id
            console.log(req.session)
            console.log("Setting ",req.session.user)
            console.log("Logged in successfully")
            
            return res.redirect('/home')
        }
        console.log(users)
        alert("invalid Login")
        return res.redirect('/')
    }else{
        return res.redirect('/')
    }

})

app.post('/register',(req,res)=>{
    // alert('user registered')
    console.log("The Server has got a Registration Request")
    const{uname,email,password,pass2} = req.body
    console.log(req.body)
    console.log(uname, email,password,pass2)
    if(uname && email && password){
        const exists = users.some(
            user => user.email == email
        )
        if(!exists){
            console.log("Creating a new user exists")
            const user = {
                id : users.length + 1,
                name : uname,
                email : email,
                password : password
            }
            users.push(user)
            req.session.user = user.id
            console.log("New User Created, Redirecting to Home")
            console.log(users)
            return res.redirect('/home')
        }else{
            console.log("User already exists")
            // flagging an error that the user exists
            alert("The email id is already registered. Please Login")
            return res.redirect('/')        

        }
        
    }
    return res.redirect('/')
})

app.post('/logout',(req,res)=>{
    console.log("Got the logout request")
    if (req.session.user) {
        res.clearCookie(SESS_NAME);
    }res.redirect('/');
})

app.listen(PORT, ()=>{
    console.log(`Listening to PORT: http://localhost:${PORT}`)
})


