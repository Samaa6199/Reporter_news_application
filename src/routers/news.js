const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const News = require('../models/news')
const multer = require('multer')
const Reporter = require('../models/reporters')

// Post News
router.post('/news' , auth , async(req,res)=>{
    try{
        const news = new News({...req.body , author:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

// Get News By ID
router.get('/news/:id' , auth , async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id , author:req.reporter._id})
        if(!news){
            return res.status(404).send('The News Was not found')
        }
            res.status(200).send(news)
    }
    catch(e){
            res.status(500).send(e.message)
    }
})

// Get All News 
router.get('/allnews' , auth , async(req,res)=>{
    try{
        await req.reporter.populate('news')
        res.send(req.reporter.news)
    }
    catch(e){
        res.send(500).send(e.message)
    }
})


//Patch News
router.patch('/news/:id' , auth , async(req,res)=>{
    try{
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const news = await News.findOne({_id , author:req.reporter._id})
        if(!news){
            return res.status(404).send('News Was not found')
        }
            updates.forEach((el)=> news[el] = req.body[el])
            await news.save()
            res.send(task)
    }
    catch(e){
            res.status(500).send(e.message)
    }
})

// Delete News
router.delete('/news/:id' , auth , async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOneAndDelete({_id , author:req.reporter._id})
        if(!news){
            return res.status(404).send('News was not found')
        }
            res.status(200).send(news)
    }
    catch(e){
            res.status(500).send(e.message)
    }
})

// Upload Image
const uploads = multer({
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|jfif|png)$/)){
            cb(new Error ('Upload image please !'))
        }
            cb(null,true)
    }
})

router.post('/news/avatar' , auth , uploads.single('avatar') , async(req,res)=>{
    try{
        req.news.avatar = req.file.buffer
        await req.news.save()
        res.send('Image uploaded Successfully')
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

router.get('/reporterdata/:id' , auth , async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id , author:req.reporter._id})
        if(!news){
            res.status(404).send('the news was not found')
        }
            await news.populate('author')
            res.status(200).send(news.author)
    }
    catch(e){
            res.status(500).send(e.message)
    }
})

module.exports = router