require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const routes = require('./routes/routes')

const app = express();

const port = process.env.port || 4000;
mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
db.on('error',(error) => console.log(error))
db.once('open',()=>console.log("connected to the database"));

// middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

app.use(express.static("uploads"));
// set template engine 

app.set("view engine","ejs")

// route prefix
app.use("/",routes)



app.listen(port,()=>{
    console.log(`server stsrted :${port}`)
});