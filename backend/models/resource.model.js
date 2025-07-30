import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    link : {
        type : String,
        required : true,
        trim : true
    },
    type : { 
        type : String,
        required : true,
        enum : ["document","Yt-Link"]
    },
    subject : { 
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subject",
        required : true
    },
    class : { 
        type : mongoose.Schema.Types.ObjectId,
        ref : "Class",
        required : true
    },
    createdBy : { 
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
},{timestamps:true})

const Resource = mongoose.model("Resource",resourceSchema);
export default Resource;
