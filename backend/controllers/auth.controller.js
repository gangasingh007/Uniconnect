import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { userLoginValidator, userRegisterValidator, userUpdateValidator } from "../types/userValidater";
import bcrypt from "bcryptjs";

export const  register = async (req, res) => {
    // get the data from the user through frontend
  const { firstName, lastName , password , email ,
    role, courseName, section, semester, rollNumber} = req.body;
    
    try {
    // check if all fields are present
   if(!firstName || !lastName || !password || !email ||
      !role || !courseName || !section || !semester || !rollNumber) { 
        return res.status(400).json({
            msg: "All fields are required"
            });
    }

    // check if the user already exists
    const isExisting = await User.findOne({
        email: email,
        rollNumber: rollNumber
    });

    if(isExisting) {
        return res.status(400).json({
            msg: "User already exists"
        });
    }

    // validate the data using zod
   const payload = req.body;
   const parsedPayload = userRegisterValidator.safeParse(payload);
   
   if (!parsedPayload.success) {
     return res.status(400).json({
        msg : "Invalid data",
     })
   }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await User.create({
        firstName,
        lastName,
        password: hashedPassword,
        email,
        role,
        courseName,
        section,
        semester,
        rollNumber
    });
    const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    res.status(201).json({
        msg: "User registered successfully",
        token,
        user: {
            firstName: newuser.firstName,
            lastName: newuser.lastName,
            email: newuser.email,
            role: newuser.role,
            courseName: newuser.courseName,
            section: newuser.section,
            semester: newuser.semester,
            rollNumber: newuser.rollNumber
        }
    });
   } catch (error) {
    res.status(500).json({
        msg: "Internal server error",
        error: error.message
    });
   }

}

export const login = async (req, res) => {
   // get the data from the user through frontend 
  const { rollNumber, password } = req.body;

  try {
    // check if all fields are present
    if(!rollNumber || !password) {
    return res.status(400).json({
        msg: "rollNumber and password are required"
    });
  }

  // checking if the user exists
  const user = await User.findOne({
        rollNumber: rollNumber
  });

    if(!user) {
        return res.status(400).json({
            msg: "User does not exist"
        });
    }   

    // validate the data using zod
    const payload = req.body;
    const parsedPayload = userLoginValidator.safeParse(payload);
    
    if (!parsedPayload.success) {
      return res.status(400).json({
         msg : "Invalid data",
      })
    }

    // checking if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, password);
    if(!isPasswordCorrect) {
        return res.status(400).json({
            msg: "Invalid credentials"
        });
    }
    // generating the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d" 
    });
    res.status(200).json({
        msg: "User logged in successfully",
        token,
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            courseName: user.courseName,
            section: user.section,
            semester: user.semester,
            rollNumber: user.rollNumber
        }
    });
  } catch (error) {
    res.status(500).json({
        msg: "Internal server error",
        error: error.message
    }); 
  }
}

export const updateUser = async (req, res) => {
    // get the data from the user through frontend
    const { firstName, lastName, email, courseName, section, semester, rollNumber } = req.body;
    
    try {
        // check if all fields are present
        if(!firstName || !lastName || !email || !courseName || !section || !semester || !rollNumber) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }
        
        // validate the data using zod
        const payload = req.body;
        const parsedPayload = userUpdateValidator.safeParse(payload);
        
        if (!parsedPayload.success) {
            return res.status(400).json({
                msg: "Invalid data",
            });
        }
        // updating the user
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            firstName,
            lastName,
            email,
            courseName,
            section,
            semester,
            rollNumber
        }, { new: true });
    
        res.status(200).json({
            msg: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
}  

export const getMe = async (req, res) => {
    try {
        // Fetch the user from the database using the userId from the request
        const user = await User.findById(req.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ error: { message: "User not found" } });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: { message: "Internal server error" } });
    }
}