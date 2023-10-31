const Job = require("../models/jobModel");

exports.createJob = (req, res) => {
    const jobData = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "Job fields cannot be empty!"
        });
    }

    const job = new Job(jobData);
    job.createdBy = req.user;

    job
        .save()
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send(
            {
                message: err.message || "Something went wrong while creating new job offer!"
            }
        ));
};

exports.findAllJobs = (req, res) => {
    Job
        .find()
        .populate("createdBy")
        .then(jobs => {
            if (!jobs || jobs.length === 0)
                return res.status(404).send({
                    message: "No jobs found!"
                })
            res.send(jobs)
        })
        .catch(err => res.status(500).send(
            {
                message: err.message || "Something went wrong while retieving all jobs!"
            }
        ));
}

exports.findJob = (req, res) => {
    Job
        .findById(req.params.jobId)
        .populate("createdBy")
        .then(job => {
            if (!job)
                return res.status(404).send({
                    message: "Job with id " + req.params.jobId + " not found!"
                })
            res.send(job)
        }
        )
        .catch(err => res.status(500).send(
            {
                message: err.message || "Something went wrong while retieving job with id " + req.params.jobId
            }
        ))
}

exports.updateJob = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "User can not be empty",
        });
    }

    Job
        .findByIdAndUpdate(req.params.jobId, req.body, { new: true })
        .then(job => {
            if (!job)
                return res.status(404).send({
                    message: "Job with id " + req.params.jobId + " not found!"
                })
            res.send(job)
        })
        .catch(err => res.status(500).send(
            {
                message: err.message || "Something went wrong while updating job with id " + req.params.jobId
            }
        ))
}

exports.deleteJob = (req, res) => {
    Job
        .findByIdAndDelete(req.params.jobId)
        .then(job => {
            if (!job)
                return res.status(404).send({
                    message: "Job with id " + req.params.jobId + " not found!"
                })
            res.send({
                success: true,
                message: "Job deleted!"
            })
        })
        .catch(err => res.status(500).send({
            message: err.message || "Something went wrong while deleting job with id " + req.params.jobId
        }))
}

exports.filterJobs = async (req, res) => {
    const { company, minSalary, maxSalary, location, contract, pastWeek, pastMonth } = req.query;
    const filters = {};
    const startOfPastWeek = new Date();
    startOfPastWeek.setDate(startOfPastWeek.getDate() - 7);
    const startOfPastMonth = new Date();
    startOfPastMonth.setMonth(startOfPastMonth.getMonth() - 1);

    if (company) filters.company = company;
    if (location) filters.location = location;
    if (contract) filters.contract = contract;
    if (minSalary) filters.salary = { $gte: parseInt(minSalary) };
    if (maxSalary) filters.salary = { ...filters.salary, $lte: parseInt(maxSalary) };
    if (pastWeek) filters.pastWeek = { $gte: startOfPastWeek }
    if (pastMonth) filters.pastMonth = { $gte: startOfPastMonth }

    await Job
        .find(filters)
        .sort({ createdAt: -1 })
        .then(jobs => {
            if (!jobs || jobs.length === 0)
                return res.status(404).send({
                    message: "No jobs found with these filters"
                })
            res.send(jobs);
        })
        .catch(err => res.status(500).send({
            message: err.message || "Something went wrong while filtering jobs"
        }))

}