const mongoose = require('mongoose')


const newsSchema = new mongoose.Schema({
    title : { 
        type : String , 
        required : true,
        trim : true
    },
    description : { 
        type: String,
        required : true,
        trim : true
    },
    newsphoto:{
        type : Buffer
    },
    author :{ 
        type: mongoose.Schema.Types.ObjectId,
        required : true , 
        ref : 'Reporter'
    }
})


const News = mongoose.model('News' , newsSchema)
module.exports = News