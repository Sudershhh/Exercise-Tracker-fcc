require('dotenv').config()
const express = require('express')
const cors = require('cors')
const User = require('./Schemas/UserSchema')
const Exercises = require("./Schemas/ExerciseSchema")


const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose');



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
    
    res.status(200).json(allUsers)
  }catch(error)
  {
    res.status(500).json(error)
  }

  //array - username and _id

})


//form data
app.post("/api/users/:_id/exercises", async function(req,res)
{ 

  //descvription, duratrion, date-optional if no datem then current date
  const _id = req.params._id;
  
  try {
    const user = await User.findById({_id}, { _id: 1, username: 1 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { description, duration, date } = req.body;
    let currentDate;
    if (!date) {
      currentDate = new Date().toDateString();
    } else {
      currentDate = new Date(date).toDateString();
    }

    const exerciseObject = {
      description,
      duration: parseInt(duration),
      date:currentDate
    };

    let userExercises = await Exercises.findOne({ userId: _id.toString() });

    if (!userExercises) {
      let log = [];
      log.push(exerciseObject);
      const newExercise = new Exercises({
        userId: _id,
        count: 1,
        log: log
      });
      const savedExercise = await newExercise.save();
      return res.status(200).json({
        username: user.username,
        description: exerciseObject.description,
        duration: exerciseObject.duration,
        date: exerciseObject.date,
        _id: user._id
      });
    } else {
      const updatedExercises = await Exercises.findOneAndUpdate(
        { userId: _id },
        { $push: { log: exerciseObject }, $inc: { count: 1 } },
        { new: true, useFindAndModify: false }
      );
      return res.status(200).json({
        username: user.username,
        description: exerciseObject.description,
        duration: exerciseObject.duration,
        date: exerciseObject.date,
        _id: user._id
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }

  //exercise fields - return

})

//Get User's exercise logs
app.get("/api/users/:_id/logs", async function(req,res)
{

    const userId = req.params._id
    const {from,to,limit }= req.query
  try
  {
     const user = await User.findById({_id: userId},{username:1,_id:1})
     console.log("USER : ", user)
     if(!user)
      {
        res.status(404).json({'error' : 'User not found'})
        return;
      }

      const exercise = await Exercises.findOne(
        { userId: userId },
        { count: 1, 'log.date': 1, 'log.description': 1, 'log.duration': 1, _id: 1 }
      );      
      
      console.log("Exercise : ", exercise)
      if(!exercise)
        {
          res.status(404).json({'error':'Exercise not found'})
          return;
        }
        
        // let filteredExercises;
        // let count;
        //Query parameters
        // if(from || to || limit)
        //   {
        //     filteredExercises = exercises.filter(item => {
        //       const itemDate = new Date(item.date);
        //       return (
        //         (!from || itemDate >= new Date(from)) &&
        //         (!to || itemDate <= new Date(to))
        //       );
        //     });
            
        //     count = limit
        //   }
          
        //   else{
        //     filteredExercises = [...exercise]
        //     count = filteredExercises.count
        //   }



        return res.status(200).json({
          "username":user.username,
          "count":exercise.count,
          "_id":userId,
          "log":exercise.log
          
        })

      


  }
  catch(error)
  {
    res.status(500).json(error)
  }

  //log array of all exercises
  //returns users obejct iewht count - no of exercvies for that suer
})







const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
