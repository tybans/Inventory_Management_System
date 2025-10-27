import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/generateJWT";
import { addMinutes } from "date-fns";
import { Resend } from "resend";
import { generateEmailHTML } from "@/utils/generateEmailHTMLTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);



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
    const { password: savedPassword, ...others } = existingUser  // This will exclude password from the returned user object
    const accessToken = generateAccessToken(others)

    const result = { ...others, accessToken }

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

// Generate token
const generateToken = () => {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function forgotPassword(req: Request, res: Response) {

  try {
    const { email } = req.body;

    // Check if the user with this email exists
    const existingUser = await db.user.findUnique({
      where: {
        email: email
      }
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        data: null
      });
    }

    const resetToken = generateToken().toString();
    const resetTokenExpiry = addMinutes(Date.now(), 10)// Token valid for 10 minutes
    const currentTime = new Date();


    // Update user with reset token and expiryDate
    const updatedUser = await db.user.update({
      where: {
        email: email
      },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry
      }
    });
    const emailHTML = generateEmailHTML(resetToken)

    // Send the email with the reset token
    const { data, error } = await resend.emails.send({
      from: "tybans <website@resend.dev>",
      to: [email],
      subject: "Password Reset Token",
      html: emailHTML
    });

    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to send email",
        data: null,
        error: error
      });
    }

    const result = {
      userId: updatedUser.id,
      emailId: data.id
    }

    return res.status(200).json({
      message: `Password reset token sent to ${email}`,
      data: result
    })


    /*
    1. Generate a secure token and store it in the resetToken field,
    2. Set the resetTokenExpiry to a future time (e.g., 1 hour from the of the request).
    3. Send an email to the user with the reset token.
    */
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })

  }
}


export async function verifyToken(req: Request, res: Response) {

  try {
    const { token } = req.params;
    
    // Step 1: Validate token presence
    if (!token || typeof token !== "string" || token.trim() === "") {
      return res.status(400).json({
        message: "Token is missing or invalid format",
        data: null
      });
    }

    // Find the user with the provided reset token
    const existingUser = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {gte: new Date() // Check if the token is not expired
        }
      }
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid or expired token",
        data: null
      });
    }

    res.status(200).json({
      message: "Token is valid",
      data: { userId: existingUser.id, email: existingUser.email }
    });

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })

  }
}


export const changePassword = async (req: Request, res: Response) => {
  const {token} = req.params;
  const { newPassword } = req.body;
  try {
    // Find the user with the provided reset token
    const existingUser = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {gte: new Date() // Check if the token is not expired
        }
      }
    });
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid or expired token",
        data: null
      });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password and clear the reset token and expiry
    await db.user.update({
      where: { id: existingUser.id }, 
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    return res.status(200).json({
      message: "Password changed successfully",
      data: null
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    });
  }
}