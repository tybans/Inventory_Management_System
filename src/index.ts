import express, { Request, Response } from "express";
import customersRouter from "./routes/customer.route";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes

const PORT = process.env.PORT

app.use(express.json()); // Parse incoming JSON requests and make the data available in req.body

app.listen(PORT, () => {

  console.log(`Server is running on http://localhost:${PORT}`);
});



// // Create customer API endpoint

app.use("/api/v1", customersRouter)

// app.get("/api/v1/customers", getCustomers )
// app.get("/api/v2/customers", getV2Customers)