const mongoose = require('mongoose')

const exerciseSchema = mongoose.Schema({
    userId: String,
    count:Number,
    log: [
        {
          description: {
            type: String,
            required: true
          },
          duration: {
            type: Number,
            required: true
          },
          currentDate: {
            type: String,
            required: true
          }
        }
      ]
    });


module.exports = mongoose.model('Exercises', exerciseSchema)
