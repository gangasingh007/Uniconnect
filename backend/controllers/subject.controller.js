import Subject from "../models/Subject.model.js";
import Class from "../models/class.model.js";

export const createSubject = async (req, res) => {
    try {
        const classId = req.params.id;
        const { title, subjectTeacher } = req.body;
        if (!title || !subjectTeacher) {
            return res.status(400).json({ msg: "Title and subjectTeacher are required." });
        }
        // Create the subject
        const newSubject = await Subject.create({ title, subjectTeacher });
        // Add subject to class
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $push: { subject: newSubject._id } },
            { new: true }
        );
        if (!updatedClass) {
            // Rollback subject creation if class not found
            await Subject.findByIdAndDelete(newSubject._id);
            return res.status(404).json({ msg: "Class not found." });
        }
        res.status(201).json({
            msg: "Subject created and added to class successfully.",
            subject: newSubject,
            class: updatedClass
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error.", error: error.message });
    }
}