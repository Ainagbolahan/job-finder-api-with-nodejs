const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { Job } = require('../models/Job')

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
	return res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req

	const jobs = await Job.find({ createdBy: userId, _id: jobId })
	if (!jobs) {
		throw new NotFoundError('No job found')
	}
	return res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId
	const job = await Job.create(req.body)
	return res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
		body: { company, position },
	} = req

	if (company === '' || position === '') {
		throw new BadRequestError('Company and position are required')
	}

	const jobs = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, {
		new: true,
		runValidators: true,
	})
	if (!jobs) {
		throw new NotFoundError('No job found')
	}
	return res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
        } = req

    const jobs = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
    if (!jobs) {
        throw new NotFoundError('No job found')
    }
    return res.status(StatusCodes.OK).json({ jobs, count: jobs.length })

}

module.exports = {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob,
}
