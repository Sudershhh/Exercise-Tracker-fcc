const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))


class UserBase
{

  constructor()
  {
    this.users=[]

  }

  createUser(user)
  {

    this.users.push(user)
  }

  getAllUsers()
  {
    return this.users;
  }


}



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//CREATE A NEW USER
app.post('/api/users/', function(req,res)
{



// username and _id return

})


//GET ALL USERS
app.get("/api/users", function(req,res)
{

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
