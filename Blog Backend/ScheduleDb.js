const mongoose = require('mongoose');

const scheduleDb = new mongoose.Schema({
    PostId: {
        type: String,
        required: true,
        unique:true
    },
    UserId: {
        type: String,
        required: true
    },
    ScheduleTime: {
        type: Date, 
        required: true
    }
}, { collection: 'ScheduledTasks' }); 

//  Compound Index for faster queries on both PostId and UserId
scheduleDb.index({'UserId':1})

module.exports = mongoose.model('ScheduledTasks', scheduleDb);
