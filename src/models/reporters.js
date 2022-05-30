const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt=require('jsonwebtoken')

const reporterSchema = new mongoose.Schema({
    name : { 
        type : String , 
        required : true, 
        trim : true
    }, 
    email : { 
        type : String,
        required : true , 
        trim : true , 
        unique : true,
        validate(value){
            let emailReg= new RegExp('^[a-z0-9._%+-]+@[gmail|hotmail]+.[a-z]{2,4}$')
            if(!validator.isEmail(value) || !emailReg.test(value)){
                throw new Error ('Please enter valid email')
            }
        }
    },
    password: {
        type : String , 
        required : true , 
        minlength : 5,
        trim : true , 
        validate(value){
            let passwordReg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
            if(!passwordReg.test(value)){
                throw new Error('Password must include uppcase / lowercase / numbers / special characters')
            }
        }
    },
    phoneNumber : {
        type : String, 
        required : true,
        validate(value){
            /*let phoneReg =new RegExp('^(\+201|01|00201)[0-2,5]{1}[0-9]{8}')
            if(!phoneReg.test(value)){
                throw new Error ('Please Enter A vaild Phone Number')
            }*/
            if(!validator.isMobilePhone(value ,'ar-EG')){
                throw new Error ('Please Enter A Vaild Phone Number')
            }
        }
    },
    reporteravatar : { 
        type : Buffer
    },
    tokens : [{
        type : String ,
    }]
})


// Password Hashing
reporterSchema.pre('save',async function(){
    const reporter = this 
    if(reporter.isModified('password')){
        reporter.password = await bcryptjs.hash(reporter.password,8)
    }
})

// Login Function 
reporterSchema.statics.findByCredentials = async (email , password)=>{
    const reporter = await Reporter.findOne({email})
    console.log(reporter)
    if(!reporter){
        throw new Error ('No Account was not found , please check your email or password again')
    }
    const passwordMatch = await bcryptjs.compare(password,reporter.password)
    if(!passwordMatch){
        throw new Error ('No Account was not found , please check your email or password again')
    }
    return reporter
}

// Generate token 
reporterSchema.methods.generateToken = async function(){
    const reporter = this 
        const token = jwt.sign({_id:reporter.id.toString()},'newsapp')
        reporter.tokens = reporter.tokens.concat(token)
        await reporter.save()
        return token
}

// Virtual Relation 
reporterSchema.virtual('news' , {
    ref: 'News',
    localField: '_id',
    foreignField : 'author'
})

const Reporter = mongoose.model('Reporter' , reporterSchema)
module.exports = Reporter