import express, { Request, Response, Router } from "express";
import amazonProductData from "../models/amazonProductDataModel";

const router: Router = express.Router(); 

router.get('/', async (req: Request,res: Response) => {
    const data = await amazonProductData.find();
    res.json(data);
})

export default router;