const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const path = require('path');
const cors = require('cors');
const userRoute = require('./routes/api/user');
const multer = require('multer');

const app = express();
app.use(cors())

// Body parser middlerware
app.use(express.json());

// connect to mongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));

//user routes 
app.use('/', userRoute);

//image upload code
const upload = multer({ dest: 'uploads/' }); // Destination folder to store uploaded files

app.post('/imageUpload', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file provided' });
	}
	// Process the uploaded file as needed (e.g., save to a specific location
	
	// const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`; // Adjust the base URL and folder path as needed
	const imageUrl = `https://todolist-268j.onrender.com/uploads/${req.file.filename}`; // Adjust the base URL and folder path as needed

	res.status(200).json({ data: { imageUrl }, msg: "Image Upload Successfully" });
});

app.use('/uploads', express.static('uploads')); // Serve uploaded files statically
// ---------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server run at port ${PORT}. \n\nPlease Wait MongoDB is connecting...`));

