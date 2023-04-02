const express = require('express')
const router = express.Router()
const userModel = require('../Model/userModel')
const blockedUserModel = require('../Model/blockedUserModel')


router.post('/register', async (req, res) => {

    const { name, email, password } = req.body
    try {
        const existUser = await userModel.findOne({ email })

        if (existUser) {
            res.status(400).json({ message: 'User already exists' })
        } else {
            const newUser = new userModel({ name, email, password })
            await newUser.save()

            res.status(201).json({ message: 'User Created Successfully' })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user is already blocked
        const blockedUser = await blockedUserModel.findOne({ email: email });
        if (blockedUser && (Date.now() - blockedUser.blockedAt) < 86400000) { // 86400000 milliseconds = 24 hours
            return res.status(400).json({ message: 'This account is blocked. Please try again after 24 hours.' });
        }

        // Find the user by email and password
        const user = await userModel.findOne({ email: email, password: password });
        if (user) {
            // Reset the count and timestamp of unsuccessful login attempts for this email
            await blockedUserModel.deleteOne({ email: email });
            const currentUser = {
                email: user.email,
                password: user.password
            }
            res.status(200).json({ message: 'User Login Success' });
        } else {
            // Increment the count of unsuccessful login attempts and update the timestamp for this email
            const blockedUser = await blockedUserModel.findOneAndUpdate(
                { email: email },
                { $inc: { count: 1 }, $set: { blockedAt: Date.now() } },
                { upsert: true, new: true }
            );
            if (blockedUser.count >= 5) { // Block the user if they have reached 5 unsuccessful attempts
                return res.status(400).json({ message: 'This account is blocked. Please try again after 24 hours.' });
            }
            res.status(400).json({ message: 'User Login Failed' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.patch('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(id, { name });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;


//     const { email, password } = req.body
//     try {
//         const user = await userModel.findOne({ email: email, password: password })
//         if (user) {
//             const currentUser = {
//                 email: user.email,
//                 password: user.password
//             }
//             res.status(200).json({ message: 'User Login Success' })
//         } else {
//             res.status(400).json({ message: 'User Login Failed' })
//         }

//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// })
