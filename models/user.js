const { Schema, model } = require("mongoose")
const { createHmac, randomBytes } = require("crypto")
const { createTokenForUser } = require("../services/authentication")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // salt - use for password hashing
    // salt - is a random string
    salt:  {
        type: String,
    },
    password: {
        type: String,
        required: true,

    },
    profileImage: {
        type: String,
        default: "/images/profileImage_default.png",
    },
    role: {
        type: String,
        // eunm - ye ek array hai or ean dono ke alawa koyi other value diye to DB se error dega
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},{ timestamps: true })

// use for - hashing password
userSchema.pre("save", function() {
    const user = this;

    if(!user.isModified("password")) return

    // salt- is a random string // hash password
    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex")

    // orignal password replace kar diya
    this.salt = salt
    this.password = hashedPassword

})

// Match user provided password and Database saved password
// ye ek virtual function hai - jo token return kare ga
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email })
    if(!user) throw new Error('User not found')

    const salt = user.salt;
    const hashedPassword = user.password

    const userprovidedHash = createHmac("sha256", salt).update(password).digest("hex")

    if( hashedPassword !== userprovidedHash ) throw new Error("Incorrect Password")

    const token = createTokenForUser(user)
    return token
})

const User = model("user", userSchema)

module.exports = User