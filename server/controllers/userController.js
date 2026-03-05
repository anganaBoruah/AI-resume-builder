// controller for user reg

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

// POST: /api/users/register
export const registerUser = async(req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({message: 'User created successfully', token, user: newUser})
    } catch (error) {
        return res.status(400).json({message: 'error.message'})

    }
    
}


//controller for user login
// POST: /api/users/login
export const loginUser = async(req, res) => {
    try{
        const { email, password} = req.body;

        if( !email || !password){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid user or password'})
        }
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid user or password'})
        }
        
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({message: 'login successful', token, user})
    } catch (error) {
        return res.status(400).json({message: 'error.message'})

    }
    
}


//controller for getting user by id
//GET:/api/users/data

export const getUserById = async(req, res) => {
    try{
        const userId = req.userId;

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found.'})
        }
        
        //return user
        User.password = undefined;
            return res.status(200).json({user})

       
    } catch (error) {
        return res.status(404).json({message: 'error.message'})

    }

}
// POST: /api/users/google
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const { sub: googleId, email, name } = ticket.getPayload()

        let user = await User.findOne({ $or: [{ googleId }, { email }] })
        if (!user) {
            user = await User.create({ name, email, googleId })
        } else if (!user.googleId) {
            user.googleId = googleId
            await user.save()
        }

        const token = generateToken(user._id)
        user.password = undefined
        return res.status(200).json({ message: 'Login successful', token, user })
    } catch (error) {
        return res.status(401).json({ message: 'Google authentication failed' })
    }
}

    //controller for getting user resumes
    // GET: /api/users/resumes

export const getUserResumes = async (req, res) => {
    try{
        const userId = req.userId;

        const resumes =await Resume.find({userId})
        return res.status(200).json({resumes})
    }
    catch(error){
        return res.status(400).json({message: error.message})

    }

    
}
