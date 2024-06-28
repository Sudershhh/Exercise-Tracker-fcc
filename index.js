require('dotenv').config()
const express = require('express')
const cors = require('cors')
const User = require('./Schemas/UserSchema')



const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose');
const req = require('express/lib/request');



app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});





app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//CREATE A NEW USER
app.post('/api/users/', async function(req,res)
{

  const {username} = req.body
  try
  {
    const newUser = new User({username})
    const savedUser = await newUser.save() 
    const {_id} = savedUser
    console.log({"_id":_id.toString(), "username":username})
    res.json({"_id":_id.toString(), "username":username})
  }catch(error)
  {
    res.status(500).json({ message: 'Error adding user', error });  }

})


//GET ALL USERS
app.get("/api/users", async function(req,res)
{ 

  try
  { 

    const allUsers = await User.find({},{_id:1,username:1})
    console.log(allUsers)
    
    res.status(200).json(allUsers)
  }catch(error)
  {
    res.status(500).json(error)
  }

  //array - username and _id

})


//form data
app.post("/api/users/:_id/exercises", function(req,res)
{ 

  //descvription, duratrion, date-optional if no datem then current date

  //exercise fields - return

})

//Get User's exercise logs
app.get("/api/users/:_id/logs", function(req,res)
{

  //log array of all exercises
  //returns users obejct iewht count - no of exercvies for that suer
})







const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
