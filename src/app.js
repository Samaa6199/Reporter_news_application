const Reporter = require('./models/reporters')
const News = require('./models/news')
const reporterRouter = require('./routers/reporters')
const newsRouter = require('./routers/news')


const express  = require('express')
const app = express()
const port = process.env.PORT || 3000

require('./db/mongoose')
app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)


app.listen(port , ()=>{(console.log('Server is running on port' + ' ' + port))})