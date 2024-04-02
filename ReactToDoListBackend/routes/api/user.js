const express = require('express');
const router = express.Router();

//user model
const users = require('../../models/user')


// Create user
router.post('/user', async (req, res) => {
	console.log(req.body);
	const alreadyExist = await users.findOne({$and : [{email: req.body.email },{isActive:true}]});
	if (alreadyExist) {	
		res.status(200).json({ data: {}, msg: "User Already exist. Please Login" });
		return;
	}

	try {
		req.body.createdAt = Date.now();
		req.body.notes = [];
		req.body.isActive = true;
		const user = new users(req.body);
		const post = await user.save();
		if (!post) throw Error('Something went wrong while creating the user');
		res.status(200).json({ data: post, msg: "Registration successfull. Please Login" });
	}
	catch (err) {
		res.status(400).json({ msg: err })
	}
});


// Get userdetails for login
router.post('/login', async (req, res) => {
	try {
		const user = await users.findOne({ $and: [{ email: req.body.email }, { isActive: true }] });
		if (user) {
			if (user.password === req.body.password) {
				res.status(200).json({ data: user, msg: "Login Successfully" });
			}
			else {
				res.status(401).json({ data: {}, msg: "Password is wrong. Please Enter correct password" });
			}
		}
		else {
			res.status(401).json({ data: user, msg: "UnAuthorised user. Please register" });
		}
	}
	catch (err) {
		res.status(500).json({ data: {}, msg: err })
	}
})


// Update user
router.patch('/user/:id', async (req, res) => {

	if (req.body.type === "delete") {
		req.body.isActive = false;
		try {
			const user = await users.findByIdAndUpdate(req.params.id, req.body);
			if (!user) throw Error('Something went wrong while deleting the user!');
			res.status(200).json({ data: user, msg: "user deleted successfully" });
		}
		catch (err) {
			res.status(400).json({ msg: err })
		}
	}

	else {
		try {
			const user = await users.findByIdAndUpdate(req.params.id, req.body);
			if (!user) throw Error('Something went wrong while updating the user!');
			res.status(200).json({ data: user, msg: "user updated successfully" });
		}
		catch (err) {
			res.status(400).json({ msg: err })
		}
	}
});


// Get user by Id
router.get('/user/:id', async (req, res) => {
	try {
		const user = await users.findById(req.params.id);
		if (!user) throw Error('Something went wrong while updating the user!');
		res.status(200).json({ data: user, msg: "user details fetched successfully" });
	}
	catch (err) {
		res.status(400).json({ msg: err })
	}
})

//Permanent Delete user
router.delete('/user/:id', async (req, res) => {
	try {
		const user = await users.findByIdAndDelete(req.params.id);
		if (!user) throw Error('No user found');
		res.status(200).json({ data: user, msg: "User deleted successfully" });
	}
	catch (err) {
		res.status(400).json({ msg: err })
	}
});


module.exports = router;