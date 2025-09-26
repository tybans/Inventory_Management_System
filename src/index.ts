import express, { Request, Response } from "express";
import customersRouter from "./routes/customer.route";
import usersRouter from "./routes/user.route";
import shopRouter from "./routes/shop.route";
import supplierRouter from "./routes/supplier.route";
import loginRouter from "./routes/login.route";
import unitRouter from "./routes/unit.route";
import brandRouter from "./routes/brand.route";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/products.route";

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

app.use("/api", customersRouter) 
app.use("/api", usersRouter)
app.use("/api", shopRouter)
app.use("/api", supplierRouter)
app.use("/api", loginRouter)
app.use("/api", unitRouter)
app.use("/api", brandRouter)
app.use("/api", categoryRouter)
app.use("/api", productRouter)


// app.get("/api/v1/customers", getCustomers )
// app.get("/api/v2/customers", getV2Customers)