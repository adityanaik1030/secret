require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs =  require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://Aditya:qwertyleoadi@cluster0.ubcpoqy.mongodb.net/userDB", {useNewUrlParser: true});

// const userSchema = {
//     email: String,
//     password: String
// }
// This is was followed in other projects since we made authentication available to the page, we are using below mentioned code.
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// During 2nd layer of Authentication
// These two lines are also added for the purpose of authentication. In the second line we specifies encryptedFields to password because we only
// want our password to be encrypted and not the email
// const secret = "Thisisourlittlesecret";
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]})

// While adding third layer of authentication that is environmental variable .env file was created and the 1st line of above code was added to .env file
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]})


const User = new mongoose.model("User", userSchema)


app.get("/", function(req,res){
    res.render("home");
})

app.get("/login", function(req,res){
    res.render("login");
})

app.get("/register", function(req,res){
    res.render("register");
})


app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save()
        .then(results => {
            res.render("secrets")
        })
        .catch(error =>{
            console.log(err);
        })    
});


app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then(foundUser =>{
        if(foundUser.password === password){
            res.render("secrets")
        }
        else{
            console.log("Register frst")
        }
    })
    .catch(error =>{
        console.log(error);
    })
});







app.listen(3000, function(){
    console.log("Server started on port 3000."); 
})