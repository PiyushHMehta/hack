const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const User = require('./models/User');
const Todo = require('./models/Todo');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');
require('dotenv').config()
const cloudinary = require('cloudinary').v2 ; 
const app = express()
mongoose.connect(process.env.MONGO_URL)
const jwtSecret = process.env.JWT_SECRET


cloudinary.config({
    cloud_name: "dbzhggoi6",
    api_key: 317149825625866 ,
    api_secret: "j7k12yGi6NKMztgCd7bvAVlmCiM"
})
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
const bcryptSalt = bcrypt.genSaltSync(10)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/test', (req, res) => {
    res.json('test ok')
})

app.post('/register', async (req, res) => {
    const { name, email, password, interests } = req.body;
    console.log(req.body)
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const userDoc = await User.create({
            name, email, password: hashedPassword, interests
        });
        res.status(201).json(userDoc);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create new user.', details: error });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const userDoc = await User.findOne({ email })
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
            jwt.sign({ id: userDoc._id, email: userDoc.email }, jwtSecret, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token).json(userDoc)
            })
        }
    }
})

app.get('/profile', async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        try {
            const userData = jwt.verify(token, jwtSecret);
            const { id } = userData;
            const user = await User.findById(id);
            if (user) {
                // console.log(user);
                const { name, email, _id } = user;
                res.json({ name, email, _id });
            } else {
                // Handle case where user is not found
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            // Handle JWT verification errors
            console.error('JWT verification error:', err);
            res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        // Handle case where token is missing
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.post('/post-todo', async (req, res) => {
    const { user, work, deadline } = req.body
    try {
        const workToDo = await Todo.create({
            user, work, deadline
        })
        res.status(201).json(workToDo)
    } catch (error) {
        console.error('Error creating new task:', error);
        res.status(500).json({ error: 'Failed to add new task.', details: error });
    }
})

app.get('/get-todo', async (req, res) => {
    const { token } = req.cookies
    if (token) {
        const userData = jwt.verify(token, jwtSecret)
        const { id } = userData
        const userTodoTasks = await Todo.find({user: id})
        console.log(userTodoTasks);
        res.json(userTodoTasks)
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
})


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // Check if the 'uploads' directory exists, if not, create it
//         const uploadDir = path.join(__dirname, 'uploads');
//         fs.mkdir(uploadDir, { recursive: true }, (err) => {
//             if (err) {
//                 return cb(err, null);
//             }
//             cb(null, uploadDir);
//         });
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// })
// const upload = multer({ storage: storage });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'your_folder_name', // optional, specify the folder to upload to
//       allowed_formats: ['jpg', 'png', 'jpeg'], // optional, specify the allowed file formats
//       // You can add more configuration options as needed
//     },
//   });
  

  
  // Middleware to handle file upload
//   const uploadToCloudinary = (req, res, next) => {
//     // Use multer middleware to handle file upload
//     upload.single('file')(req, res, function(err) {
//       if (err instanceof multer.MulterError) {
//         // A Multer error occurred when uploading
//         return res.status(500).json({ message: 'Multer error', error: err });
//       } else if (err) {
//         // An unknown error occurred
//         return res.status(500).json({ message: 'Unknown error', error: err });
//       }
//       // File uploaded successfully
//       next();
//     });
//   };

app.post('/upload' ,(req, res) => {
    console.log("Req file ",req.file);
    res.send('File uploaded successfully');
});

app.get('/files', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).json({ error: 'Failed to read directory' });
            return;
        }
        res.json(files);
    });
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})

app.post('/delete-Todo' , async (req ,res) => {
    try {
        const { id } = req.body ; 
        console.log(id);
        const deletedDoc = await Todo.findByIdAndDelete(id) ; 
        // console.log(deletedDoc);
        res.json({msg: "success"}) ; 
    } catch (error) {
        res.json(error) ; 
    }
})

app.listen(3000 ,() => {
    console.log('Listening on port',3000);
})