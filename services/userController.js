require('dotenv').config()
const UserRepository = require('./userRepository.js')
const jwt = require('jsonwebtoken')
const createUser = async (req, res) =>{
    try{
        const createUser = await UserRepository.create(req.body)
        res.status(200).json({message:'User created successfully', createUser})
    }catch(err){
        if(err.code === 'ER_DUP_ENTRY'){
          return res.status(400).json({ error: 'email already exists' });
        }
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' });
    }
  
}
const loginUser = async (req, res) =>{
    try{
        const userDetails = await UserRepository.login(req.body)
        const token =  jwt.sign(userDetails, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.cookie("access_token", token , {httpOnly: true})
        res.status(200).json({user:userDetails, token:token})
    }catch(err){
        res.status(400).json({error: err.message})
    }
}
module.exports = {createUser, loginUser}    