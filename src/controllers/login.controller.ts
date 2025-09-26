import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/generateJWT";


export async function userLogin(req: Request, res: Response) {

  const {
    email,
    username,
    password,
  } = req.body

  try {

    let existingUser = null;
    if (email) {

      existingUser = await db.user.findUnique({
        where: {
          email: email
        }
      })
    }
    if (username) {
      existingUser = await db.user.findUnique({
        where: {
          username: username
        }
      })
    }

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        data: null
      })
    } 

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Invalid password",
        data: null
      })
    }

    // Destructuring to exclude password from the returned user object
    const {password: savedPassword, ...others} = existingUser  // This will exclude password from the returned user object
   const accessToken = generateAccessToken(others)

   const result = {...others, accessToken}

    return res.status(200).json({
      message: "Login successful",
      data: result
      
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })

  }

}
