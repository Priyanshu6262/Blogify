const { Router } = require("express")
const multer = require("multer")
const path = require("path")

const Blog = require("../models/blog")
const Comment = require("../models/comment")


const router = Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const fileNmae = `${Date.now()}-${file.originalname}`
    cb(null, fileNmae)
  }
})

const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user
    })
})

// Get Blog View router
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy")
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy")

  // console.log("comments", comments)
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  })
})

// Router for Comment
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})

router.post("/", upload.single('coverImage'), async (req, res) => {
    const { titel, body} = req.body
    console.log("Logged in user:", req.user)

    const blog = await Blog.create({
      body,
      titel,
      createdBy: req.user._id,
      coverImageURl: `/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`)
})

module.exports = router