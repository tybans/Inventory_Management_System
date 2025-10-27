// src/index.ts
import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

// your routers
import customersRouter from "./routes/customer.route";
import usersRouter from "./routes/user.route";
import shopRouter from "./routes/shop.route";
import supplierRouter from "./routes/supplier.route";
import loginRouter from "./routes/login.route";
import unitRouter from "./routes/unit.route";
import brandRouter from "./routes/brand.route";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/products.route";
import salesRouter from "./routes/sales.route";

dotenv.config();

const app = express();
app.use(cors());

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <--- important for form data

// views + static
app.set("view engine", "ejs");
// When running with ts-node-dev keep views inside src/views:
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public"))); // public sits at project-root/public

// Simple EJS routes (frontend pages)
app.get("/", (req, res) => res.redirect("/login"));
app.get("/login", (req, res) => res.render("login", { error: null }));
app.get("/dashboard", (req, res) => res.render("dashboard"));
app.get("/products", (req, res) => {
  res.render("products");
});

// API routers (mount before listen)
app.use("/api", customersRouter);
app.use("/api", usersRouter);
app.use("/api", shopRouter);
app.use("/api", supplierRouter);
app.use("/api", loginRouter);      // <-- your POST /auth/login
app.use("/api", unitRouter);
app.use("/api", brandRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", salesRouter);      // <-- sales router

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
