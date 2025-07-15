import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    type : {
        type: String,
        required: true,
        enum: ["file", "link"],
        trim: true
    },
    fileType: {
        type: String,
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true});    

const Resource = mongoose.model("Resource", courseSchema);
export default Resource;