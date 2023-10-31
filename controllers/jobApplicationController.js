const mongoose = require("mongoose");

const Job = require("../models/jobModel");
const JobApplication = require("../models/jobApplication");
const { handleResumeUpload } = require("../utils/uploadResume");

const conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
const gfs = Grid(conn.db);

exports.applyToJob = async (req, req) => {
    const jobApplicationData = req.body;

    if (Object.keys(jobApplicationData).length === 0) {
        return res.status(400).send({
            message: "Job Application fields cannot be empty"
        })
    }

    const buffer = req.file.buffer;

    const writestream = gfs.createWriteStream({
        filename: `${Date.now()}_${req.file.originalname}`
    })
    writestream.write(buffer);
    writestream.end();

    writestream.on("close", async (file) => {
        const jobApp = new JobApplication(jobApplicationData);
        jobApp.candidate = req.user;
        jobApp.job = Job.findById(req.params.jobId);
        jobApp.resume = file._id;

        await jobApp
            .save()
            .then(data => res.send(data))
            .catch((err) => res.status(500).send(
                {
                    message: err.message || "Something went wrong while saving your application!"
                }
            ));

    });
}