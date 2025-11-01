import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response) {

  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    role,
    gender,
    image } = req.body

  try {
    // Ckeck if user already exists (email, username, phone)
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email
      }
    })
    const existingUserByPhone = await db.user.findUnique({
      where: {
        phone: phone
      }
    })
    const existingUserByUsername = await db.user.findUnique({
      where: {
        username: username
      }
    })
    if (existingUserByEmail) {
      res.status(409).json({
        message: `User with this email ${email} already exists`,
        data: null
      })
      return
    }
    if (existingUserByPhone) {
      res.status(409).json({
        message: `User with this Phone Number ${phone} already exists`,
        data: null
      })
      return
    }
    if (existingUserByUsername) {
      res.status(409).json({
        message: `User with this Username ${username} already exists`,
        data: null
      })
      return
    }

    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create user  
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dob,
        role,
        gender,
        image: image ? image : "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"
      }
    })
    // Modify the returned user
    const { password: savedPassword, ...others } = newUser  // This will exclude password from the returned user object
    res.status(201).json({
      data: others,
      error: null
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })

  }

}


export async function getUsers(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    // const filteredUsers = users.map((user) => {
      
    //     // const {password, role, ...others} = user
    //     // const {password, ...others} = user
    //     // return others
      
    // })
    return res.status(200).json({
      data: users, 
      error: null
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getUserById(req: Request, res: Response) {
  const {id} = req.params
  try {
    const user = await db.user.findUnique({
      where: {
        id: id
      }
    })
    
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found"
      });
    }

    const {password, ...others} = user  // This will exclude password from the returned user object
      
   
    return res.status(200).json({
      data: others, 
      error: null
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function updateUserById(req: Request, res: Response) {
  const {id} = req.params
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image } = req.body
  try {
    // If existing user
    const existingUser = await db.user.findUnique({
      where: {
        id: id
      }
    })
    // if not exist we run 404
    if (!existingUser) {
      return res.status(404).json({
        data: null,
        error: "User not found"
      });
    }
    // if email, username, phone are unique
    if (email && email !== existingUser.email) {
      const userWithEmail = await db.user.findUnique({
        where: {
          email: email
        }
      })
      if (userWithEmail) {
        return res.status(409).json({
          data: null,
          error: "Email already in use"
        });
      }
    }
    if (username && username !== existingUser.username) {
      const userWithUsername = await db.user.findUnique({
        where: {
          username: username
        }
      })
      if (userWithUsername) {
        return res.status(409).json({
          data: null,
          error: "Username already in use"
        });
      }
    }
    if (phone && phone !== existingUser.phone) {
      const userWithPhone = await db.user.findUnique({
        where: {
          phone: phone
        }
      })
      if (userWithPhone) {
        return res.status(409).json({
          data: null,
          error: "Phone number already in use"
        });
      }
    }

    // Hash the password
    let hashedPassword = existingUser.password
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // update the user
    const updatedUser = await db.user.update({
      where: {
        id: id
      },
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image
      }
    })
    // return the updated user without password
    
    const {password: savedPassword, ...others} = updatedUser  // This will exclude password from the returned user object
      
   
    return res.status(200).json({
      data: others, 
      error: null
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function updateUserPasswordById(req: Request, res: Response) {
  const {id} = req.params
  const { oldPassword, newPassword } = req.body
  try {
    // get the user
    const user = await db.user.findUnique({
      where: {
        id: id
      }
    })
    
    // if not exist we run 404
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found"
      });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        data: null,
        error: "Old password is incorrect"
      });
    }

    // Hash the new password and update
    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    const updatedUser = await db.user.update({
      where: {
        id: id
      },
      data: {
        password: hashedPassword
      }
    })
    const {password: savedPassword, ...others} = updatedUser  // This will exclude password from the returned user object
      
   
    return res.status(200).json({
      data: others, 
      error: null
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function deleteUserById(req: Request, res: Response) {
  const {id} = req.params
  try {
    const user = await db.user.findUnique({
      where: {
        id: id
      }
    })
    
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found"
      });
    }

    // const deletedUser = await db.user.delete({
    await db.user.delete({
      where: {
        id: id
      }
    })
   
    return res.status(200).json({
      success: true, 
      error: null
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getAttendants(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        role: 'ATTENDANT'
      }
    })
    const filteredUsers = users.map((user) => {
      
        // const {password, role, ...others} = user
        const {password, ...others} = user
        return others
      
    })
    return res.status(200).json({
      data: filteredUsers, 
      error: null
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}
