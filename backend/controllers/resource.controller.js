import Subject from "../models/Subject.model.js";



export const getResources = async (req,res) => {
    const subjectId = req.params.id;

    // find the subject if exists
    const isSubject = await Subject.findById(subjectId);

    if (!isSubject) {
        return res.status(404).json({
            msg: "Subject not found"
        });
    }

    // list the resources for that subject

    try {
        const resources = await isSubject.populate('resources');
        res.status(200).json({
            msg: "Resources fetched successfully",
            resources: resources.resources || []
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching resources",
            error: error.message
        });
    }
}