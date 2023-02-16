const { StatusCodes } = require('http-status-codes')
const { User } = require('../models/User')
const JWT = require('jsonwebtoken')

const register = async (req, res) => {
	const { name, email, password } = req.body
	// const salt = await bcrypt.genSalt(10);
	// const hashedPassword = await bcrypt.hash(password, salt);

	// const tempuser = {name,email,password:hashedPassword}

	const user = await User.create({ ...req.body })
	const token = user.generateToken()
	// console.log(token);

	res.status(StatusCodes.CREATED).json({ user, token })
}

const login = async (req, res) => {
	const user = await User.findOne({ email: req.body.email })
	if (!user) {
		return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid email' })
	}
	const comparePassword = user.comparePassword(req.body.password)
	if (!comparePassword) {
		return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid password' })
	}

	const token = user.generateToken()
	return res.status(StatusCodes.OK).json({
		token,
		user: {
			name: user.name,
			_id: user._id,
			email: user.email,
		},
	})
}

module.exports = {
	register,
	login,
}
