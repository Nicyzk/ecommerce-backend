const express = require('express')
const env = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')
const adminAuthRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const initialDataRoutes = require('./routes/admin/initialData')
const path = require('path')

const app = express()

//environment variables
env.config()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')))

app.use('/auth/admin', adminAuthRoutes)
app.use('/initialdata/admin', initialDataRoutes)
app.use('/auth', authRoutes)

app.use('/category', categoryRoutes)
app.use('/product', productRoutes)
app.use('/cart', cartRoutes)

app.use((error, req, res, next) => {
    if (!error.statusCode) {
        error.statusCode = 500
    }
    res.status(error.statusCode).json({
        errorMessage: error.message
    })
})

app.use('/', (req, res, next) => {
    res.status(404).json({
        errorMessage: "No endpoint found"
    })
})

//mongodb connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.uzw3e.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(() => {
    console.log('database connected')
    app.listen(process.env.PORT, () => {
        console.log('server started')
    })
})
.catch((err) => {
    console.log("connection to database failed")
})
