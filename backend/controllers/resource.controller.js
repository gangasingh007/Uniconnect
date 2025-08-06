import Subject from "../models/Subject.model.js";
import Resource from "../models/resource.model.js";
import Class from "../models/class.model.js";
import mongoose from "mongoose";
import { createResourceSchema } from "../types/resource.validatior.js";

export const createYtresource = async (req, res)=>{
    try {
        const { classId, subjectId } = req.params;
        const { title, link } = req.body;
        const createdBy = req.userId; // from authMiddleware

        // Validate input
        if (!title || !link) {
            return res.status(400).json({ msg: "Title and link are required." });
        }

        // validate using zod
        const parsedPayload = createResourceSchema.safeParse(req.body);
        if (!parsedPayload.success) {
            return res.status(400).json({ msg: "Invalid data" });
        }

        if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({ msg: "Invalid Class or Subject ID format." });
        }

        // Check if class and subject exist and are related
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ msg: "Class not found." });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ msg: "Subject not found." });
        }

        if (!classDoc.subject.includes(subject._id)) {
            return res.status(400).json({ msg: "Subject does not belong to this class." });
        }

        // Create the new resource and add it to the subject
        const newResource = await Resource.create({
            title, 
            link,
            type: "Yt-Link",
            subject: subjectId,
            class: classId,
            createdBy
             });
        subject.resources.push(newResource._id);
        await subject.save();

        // Send success response
        res.status(201).json({ msg: "YouTube resource created and added to subject successfully.", resource: newResource });
    } catch (error) {
        console.error("Error creating YouTube resource:", error);
        res.status(500).json({ msg: "Server error.", error: error.message });
    }
}

export const getResources = async (req,res)=>{
    try {
        const { classId, subjectId } = req.params;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({ msg: "Invalid Class or Subject ID format." });
        }

        // Check if class and subject exist and are related
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ msg: "Class not found." });
        }

        const subject = await Subject.findById(subjectId).populate('resources');
        if (!subject) {
            return res.status(404).json({ msg: "Subject not found." });
        }

        if (!classDoc.subject.includes(subject._id)) {
            return res.status(400).json({ msg: "Subject does not belong to this class." });
        }

        res.status(200).json({ msg: "Resources fetched successfully.", resources: subject.resources });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ msg: "Server error.", error: error.message });
    }
}

export const deleteResource = async (req,res) => {
    const classId = req.params.classId;
    const subjectId = req.params.subjectId;
    const resourceId = req.params.resourceId;
    const userId = req.userId; // from the authmiddleware

    try {
        // check for the valid class id
    const isvalidclass = await Class.findById({
        _id : classId
    })
    if(!isvalidclass){
        return res.status(401).json({
            msg : "Class dont exist"
        })
    }

    // check for the valid subject id 
    const isvalidsubject = await Subject.findById({
        _id : subjectId
    })
    if(!isvalidsubject){
        return res.status(401).json({
            msg : "Subject dont exist"
        })
    }

    // check for the valid resource id
    const isvalidresource = await Resource.findById({
        _id : resourceId
    })
    if(!isvalidresource){
        return res.status(401).json({
            msg : "Resource dont exist"
        })
    }

    // delete the resource 
    await Resource.findByIdAndDelete({
        _id : resourceId
    })

    res.status(200).json({
        msg : "The resource has been deleted successfully"
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : "Server error"
        })
    }
}

export const updateResource = async (req,res) => {
    const classId = req.params.classId;
    const subjectId = req.params.subjectId;
    const resourceId = req.params.resourceId;
    const userId = req.userId; // from the authmiddleware
    const { title, link } = req.body;

    try {
        const isVaildClass = await Class.findById({
            _id : classId
        })
        if(!isVaildClass){
            return res.status(401).json({
                msg : "Class dont exist"
            })
        }

        const isValidSubject = await Subject.findById({
            _id : subjectId
        })

        if(!isValidSubject){
            res.status(401).json({
                msg : "Subject dont exist"
            })
        }
        const isValidResource = await Resource.findById({
            _id : resourceId
        })

        if(!isValidResource){
            res.status(401).json({
                msg : "Resource dont exist"
            })
        }

        // update the resource 
        const updatedResource = await Resource.findByIdAndUpdate({
            _id : resourceId
        },{
            title,
            link
        },{
            new : true
        })

        res.status(200).json({
            msg : "The resource has been updated successfully",
            resource : updatedResource
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg : "Server error"
        })
    }
}