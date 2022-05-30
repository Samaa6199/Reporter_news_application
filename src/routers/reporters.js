const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporters')
const News = require('../models/news')
const auth = require('../middleware/auth')
const multer = require('multer')

// Sign Up Function 
router.post('/reporter/signup',async(req,res)=>{
    try{
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

// Login Function 
router.post('/reporter/login',async(req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.send({reporter , token})
    }
    catch(e){
        res.send(e.message)
    }
})

// Profile Function 
router.get('/profile' , auth , async(req,res)=>{
    try{
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// Logout Current Reporter
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.reporter.save()
        res.send('this account logout')
    }
    catch(e){
        res.status(500).send(e)
    }
})


// Get Reporter by ID
router.get('/reporter/:id' , auth , (req,res)=>{
    const _id = req.params.id
    Reporter.findById(_id).then((reporter)=>{
        if(!reporter){
            return res.status(404).send('Reporter Not Found')
        }
            res.status(200).send(reporter)
    }).catch((e)=>{
        res.status(500).send(e.message)
    })
})

// Get All Reporter 
router.get('/reporter' , auth , async(req,res)=>{
    try{
        const reporters = await Reporter.find({})
        if(!reporters){
            throw new Error('No Reporters accounts found')
        }
            res.status(200).send(reporters)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// Update Reporter 
router.patch('/reporter/update' ,auth , (req,res)=>{
    try{
        const updates = Object.keys(req.body)
        const reporter = req.reporter
        updates.forEach((el) => (reporter[el] = req.body[el]))
        reporter.save()
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

// Delete Reporter
router.delete('/reporter/deletereporter' ,auth , async(req,res) =>{
    try{
        const reporter = req.reporter
        if(reporter){
            req.reporter.remove()
            res.status(200).send('Reporter Deleted Successfully')
        }
    }
    catch(e){
            res.status(500).send(e.message)
    }
})


// Reporter Image
const uploads = multer({
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|jfif|png)$/)){
            cb(new Error('Upload image please !'))
        }
            cb(null , true)
    }
})

router.post('/reporter/avatar' , auth , uploads.single('avatar') , async(req,res)=>{
    try{
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.send('Image uploaded Successfully')
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

module.exports = router