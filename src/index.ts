import express, { Request, Response } from "express";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes

const PORT = process.env.PORT

app.use(express.json()); // Parse incoming JSON requests and make the data available in req.body

app.listen(PORT, () => {

  console.log(`Server is running on http://localhost:${PORT}`);
});



// Create an API endpoint

app.get("/customers", async (req:Request, res:Response) => {
  const customers = [
    { name: "John Doe", email: "john.doe@example.com", phone: "+1234567890" },
    {
      name: "Joel Smith",
      email: "joel.smith@example.com",
      phone: "+0987654321",
    },
    {
      name: "tybans",
      email: "tybansh@example.com",
      phone: "912827347",
    },
  ];

  return res.status(200).json(customers);
})