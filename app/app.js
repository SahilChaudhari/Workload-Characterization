const express = require('express')
const bodyParsor = require('body-parser')
const session = require('express-session')
const path = require('path');
const { nextTick } = require('process');
const fs = require('fs')
const alert = require('alert') 
const formidable = require('formidable');
const upload = require('express-fileupload');
const amqp = require("amqplib");

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
app.use(upload())

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


async function connect(param){
    try{
        const connnection = await amqp.connect("amqp://localhost:5672")
        const channel = await connnection.createChannel()
        // make sure queue exit if not will create one
        const result1 = channel.assertQueue("jobs");
        channel.sendToQueue("jobs", Buffer.from(JSON.stringify(param)))
        // return channel
    }
    catch{
        console.log("No connection")
    }
}


// getting the testcases
app.post("/test",(req,res)=>{
    console.log("got a test request")
    // console.log(req)
    console.log(req.body.testcase)
    temp = connect(req.session.user)
  
})

app.get('/',redirectHome,(req,res)=>{
    console.log("Got a request! Sending Login Page")
    
    const {user} = req.session
    
    res.sendFile('src/index.html',{root:"."})
})


app.get('/home',redirectLogin,(req,res)=>{
    res.sendFile('src/home2.html',{root:"."})
})

app.get("/home/setting",redirectLogin,(req,res)=>{
    console.log("Got the setting request")
    res.sendFile('src/password_change.html',{root:"."})
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



// getting the upload
app.post('/upload', (req, res)=>{
    console.log("Entered the upload section")
    console.log("Body",req.body)
    console.log("Files",req.files)
    console.log()
    try {
        if (req.files){
            // console.log(req.files);
            // fileuploadfield name of file input tag
            var file = req.files.photos;
            console.log(file)
            var filename = file.name;
            const extension = path.extname(filename);
            const allowed_extension = /cpp/;
            if(!allowed_extension.test(extension)) throw "Unsupported extension";
            console.log("filename",filename);
            console.log(req.session.user)
            file.mv('./uploads/'+JSON.stringify(req.session.user)+".cpp",function(err) {
                
                if(err){
                    alert("Unable to upload the file! Please try again later")
                    response.json({status: 200});
                } else {
                    // res.send('<script>alert("File uploaded")</script>');
                    alert("File uploaded successfully")
                    res.json({status: 400});
                }
            });
        }else{
            alert("Please add a file")
        } 
    } catch (err) {
        console.log(err);
        res.send(`<script>alert(${err})</script>`);
    }
});

app.listen(PORT, ()=>{
    console.log(`Listening to PORT: http://localhost:${PORT}`)
})

