import mongoose from "mongoose";  

const userSchema = new mongoose.Schema({
    firstName :{
        type : String,
        required : true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    password : {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    courseName: {
        type: String,
        required: true,
        enum : ["Btech","Mtech"],
        trim: true,
    },
    section : {
        type: String,
        required: true,
        enum : ["A","B","C","D","CE"],
        trim: true,
    },
    semester :{
        type: String,
        required: true,
        enum : ["1","2","3","4","5","6","7","8"],
        trim: true,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },
    profileImage : {
        type: String,
        default: "https://videos.openai.com/vg-assets/assets%2Ftask_01jzxg76n0f939jxy3yxhysms7%2F1752263073_img_0.webp?st=2025-07-15T10%3A54%3A47Z&se=2025-07-21T11%3A54%3A47Z&sks=b&skt=2025-07-15T10%3A54%3A47Z&ske=2025-07-21T11%3A54%3A47Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=tLllFvuaObbDLMM%2B5kb3vbm53D9OJR0rDoImk2%2FLKBo%3D&az=oaivgprodscus"
    },
    resourcesAdded : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        default: []
    }]

},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;