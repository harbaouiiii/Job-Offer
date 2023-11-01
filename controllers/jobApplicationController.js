const Job = require("../models/jobModel");
const JobApplication = require("../models/jobApplicationModel");

const mongoose = require('mongoose');

exports.applyToJob = async (req, res) => {
    const jobApplicationData = req.body;
    const resumeData = req.resumeData;

    const jobApp = new JobApplication(jobApplicationData);
    jobApp.candidate = req.user;
    jobApp.job = Job.findById(req.params.jobId);
    jobApp.resume = resumeData;

    await jobApp
        .save()
        .then(async data => {
            const user = jobApp.candidate;
            user.applications.push(jobApp);
            await user.save();
            res.send(data);
        })
        .catch((err) => res.status(500).send(
            {
                message: err.message || "Something went wrong while saving your application!"
            }
        ));
}