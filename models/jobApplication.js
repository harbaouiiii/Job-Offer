const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    resume: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    coverLetter: {
        type: String
    },
    status: {
        type: String,
        enum: ["IN_PROGRESS","SELECTED","NOT_SELECTED","INTERVIEWING","ACCEPTED","REJECTED"],
        default: "IN_PROGRESS",
        required: true
    },
    interviewDate: {
        type: Date
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("JobApplication",jobApplicationSchema);