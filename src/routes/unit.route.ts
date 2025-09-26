import express from "express";
import { createUnit, deleteUnitById, getUnitById, getUnits, updateUnitById } from "@/controllers/unit.controller";


const unitRouter = express.Router();
unitRouter.post("/units", createUnit)
unitRouter.get("/units", getUnits)
unitRouter.get("/units/:id", getUnitById)
unitRouter.put("/units/:id", updateUnitById)
unitRouter.delete("/units/:id", deleteUnitById)

export default unitRouter;