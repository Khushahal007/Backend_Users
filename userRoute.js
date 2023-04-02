const express=require('express')
const router=express.Router()
const userModel=require('../Model/userModel')

router.post('/register', async (req, res) => {
       
    const {name, email, password} = req.body
    try {
        const existUser = await userModel.findOne({ email })

        if(existUser){
            res.status(400).json({message: 'User already exists'})
        }else{
            const newUser = new userModel({ name, email, password})
            await newUser.save()
           
            res.status(201).json({message: 'User Created Successfully'})
        }
    } catch (error) {
        res.status(400).json({message: error.message})
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
    const {email, password} = req.body
    try {
    const user= await userModel.findOne({email:email, password:password })
    if(user) {
        const currentUser={
            email:user.email,
             password:user.password
            }
        res.status(200).json({message: 'User Login Success'})
    }else{
        res.status(400).json({message: 'User Login Failed'})
    }
    
} catch (error) {
    res.status(500).json({ message: 'Internal server error' });
}
})


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



module.exports=router