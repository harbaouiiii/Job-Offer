const mongoose = require("mongoose");

const jobScheam = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Job name is required!'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Job description is required!'],
            trim: true
        },
        company: {
            type: String,
            required: [true, 'Job company is required!'],
            trim: true
        },
        location: {
            type: String,
            required: [true, 'Job location is required!'],
            trim: true
        },
        salary: {
            type: Number,
            required: [true, 'Job salary is required!'],
            min: 0
        },
        contract: {
            type: String,
            required: [true, 'Job contract is required!'],
            enum: ['KARAMA', 'CIVP', 'CDD', 'CDI', 'STAGE', 'ALTERNANCE']
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        candidates: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job",jobScheam);