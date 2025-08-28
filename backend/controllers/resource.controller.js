import Subject from "../models/Subject.model.js";
import Class from "../models/class.model.js";
import mongoose from "mongoose";
import { createResourceSchema } from "../types/resource.validatior.js";
import User from "../models/user.model.js";
import Resource from '../models/resource.model.js';
import { extractTextFromPdf } from '../utils/pdfUtils.js';
import { geminiSummarize } from '../utils/geminiUtils.js';


export const createYtresource = async (req, res) => {
    try {
        const { classId, subjectId } = req.params;
        const createdBy = req.userId;

        // Validate body using Zod
        const parsedPayload = createResourceSchema.safeParse(req.body);
        if (!parsedPayload.success) {
            return res.status(400).json({ 
                msg: "Invalid data",
                errors: parsedPayload.error.errors
            });
        }

        const { title, link } = parsedPayload.data;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({ msg: "Invalid Class or Subject ID format." });
        }

        // Check Class
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ msg: "Class not found." });
        }

        // Check Subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ msg: "Subject not found." });
        }

        // Verify subject belongs to class
        if (!classDoc.subject.some(id => id.toString() === subject._id.toString())) {
            return res.status(400).json({ msg: "Subject does not belong to this class." });
        }

        // Check User
        const user = await User.findById(createdBy);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        // Create Resource & Update Subject
        const newResource = await Resource.create({
            title,
            link,
            type: "Yt-Link",
            subject: subjectId,
            class: classId,
            createdBy: user.firstName
        });

        await Subject.findByIdAndUpdate(subjectId, {
            $push: { resources: newResource._id }
        });

        res.status(201).json({ 
            msg: "YouTube resource created and added to subject successfully.", 
            resource: newResource, 
            createdBy 
        });
    } catch (error) {
        console.error("Error creating YouTube resource:", error.stack);
        res.status(500).json({ msg: "Server error.", error: error.message });
    }
};

export const getAllClassResources = async (req, res) => {
    try {
      // We fetch all classes and use nested populate to get subjects and their resources
      const allClassData = await Class.find({})
        .select('courseName section semester subject') // Select only the fields we need from the Class
        .populate({
          path: 'subject', // Populate the 'subject' array within each Class
          select: 'title subjectTeacher resources', // Select needed fields from the Subject
          populate: {
            path: 'resources', // THEN, populate the 'resources' array within each Subject
            select: 'title link type createdAt', // Select needed fields from the Resource
          },
        })
        .lean(); // Use .lean() for faster, plain JavaScript objects
  
      // Filter out classes that have no subjects or whose subjects have no resources
      const filteredData = allClassData.filter(cls => 
        cls.subject.length > 0 && cls.subject.some(sub => sub.resources.length > 0)
      );
  
      res.status(200).json({
        message: 'Successfully fetched all class resources.',
        data: filteredData,
      });
    } catch (error) {
      console.error('Error fetching all class resources:', error);
      res.status(500).json({ message: 'Server error while fetching all resources.' });
    }
  };

export const getResources = async (req, res) => {
    try {
        const { classId, subjectId } = req.params;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({ msg: "Invalid Class or Subject ID format." });
        }

        // Fetch Class
        const classDoc = await Class.findById(classId).lean();
        if (!classDoc) {
            return res.status(404).json({ msg: "Class not found." });
        }

        // Fetch Subject with resources
        const subject = await Subject.findById(subjectId)
            .populate('resources', 'title link type createdBy')
            .lean();
        if (!subject) {
            return res.status(404).json({ msg: "Subject not found." });
        }

        // Verify relationship
        if (!classDoc.subject.some(id => id.equals(subject._id))) {
            return res.status(400).json({ msg: "Subject does not belong to this class." });
        }
        

        res.status(200).json({ 
            msg: "Resources fetched successfully.", 
            resources: subject.resources 
        });

    } catch (error) {
        console.error("Error fetching resources:", error.stack);
        res.status(500).json({ msg: "Server error.", error: error.message });
    }
};



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


export const createDocumentResource = async (req, res) => {
  try {
    const { classId, subjectId } = req.params;
    const createdById = req.userId;
    const { title, link } = req.body;

    // Validate inputs
    if (!title || !link) {
      return res.status(400).json({ message: "Both title and link are required." });
    }
    if (!/^https?:\/\//.test(link)) {
      return res.status(400).json({ message: "Please provide a valid URL." });
    }

    // Check class/subject existence...
    const classDoc = await Class.findById(classId);
    if (!classDoc) return res.status(404).json({ message: "Class not found." });

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found." });

    const creteduser = await User.findById({
        _id : createdById
    })

    const createdBy = creteduser.firstName

    const newResource = await Resource.create({
      title,
      link,
      type: "Document",
      subject: subjectId,
      class: classId,
      createdBy,
    });

    await Subject.findByIdAndUpdate(subjectId, { $push: { resources: newResource._id } });

    res.status(201).json({
      message: "Document resource created via link.",
      resource: newResource,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Could not create document link resource." });
  }
};

export const extractDocumentText = async (req, res) => {
  const { resourceId } = req.params;


  try {
    // 1. Fetch the resource from the database
    const resource = await Resource.findById(resourceId);
    
    if (!resource || resource.type !== 'Document') {
      return res.status(404).json({ message: 'Document resource not found.' });
    }

    // --- DEBUGGING STEP: Log the link to verify it's a URL ---
    console.log(`Attempting to extract text from link: ${resource.link}`);

    // This is where the error originates if resource.link is a local path
    if (!resource.link || !resource.link.toLowerCase().startsWith('http')) {
        return res.status(400).json({
            message: 'Invalid resource link. The link must be a valid web URL (http or https).',
            link: resource.link
        });
    }
    console.log("hello")
    // 2. Extract text from the PDF URL
    const extractedText = await extractTextFromPdf(resource.link);

    // 3. Send the successful response
    res.status(200).json({
      message: 'Text extracted successfully.',
      text: extractedText,
      resourceId: resource._id
    });
  } catch (error) {
    // Catch errors from both the database query and the text extraction
    console.error('Text extraction process failed:', error);
    res.status(500).json({ 
      message: 'Failed to extract text from the document.',
      error: error.message 
    });
  }
};


export const summarizeDocumentGemini = async (req, res) => {
  const { resourceId } = req.params;

  try {
    // 1. Get the document link and extract text
    const resource = await Resource.findById(resourceId);
    if (!resource || resource.type !== 'Document')
      return res.status(404).json({ message: 'Document resource not found.' });

    const text = await extractTextFromPdf(resource.link);
    console.log(text)
    // 2. Summarize with Gemini
    const summary = await geminiSummarize(text.slice(0, 8000)); // Gemini has input limits
    console.log(summary)
    // 3. (Optional) Save summary to resource
    await Resource.findByIdAndUpdate(resourceId, { summary });

    res.status(200).json({ message: 'Gemini summary generated.', summary });
  } catch (error) {
    res.status(500).json({ message: 'Gemini summarization failed', error: error.message });
  }
};
