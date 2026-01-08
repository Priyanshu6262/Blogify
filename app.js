require('dotenv').config()

const path = require("path")
const express = require('express')
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')

const Blog = require("./models/blog")
const UserRoute = require('./routes/user')
const BlogRoute = require('./routes/blog')


const { checkForAuthenticationCookie } = require("./middleweres/authentication")

const app = express()
const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGO_URl)
.then((e) => console.log("MongoDB Connect"))

app.set("view engine", "ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    })
})

app.use("/user", UserRoute)
app.use("/blog", BlogRoute)


app.listen(PORT, () => console.log( 
`server strat on PORT ${PORT}`))