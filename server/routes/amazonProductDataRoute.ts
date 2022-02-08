import express, { Request, Response, Router } from "express";
import amazonProductData from "../models/amazonProductDataModel";

const router: Router = express.Router(); 

router.get('/as', async (req: Request,res: Response) => {
    res.json(await amazonProductData.find());
})
router.post('/as/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    res.json(await amazonProductData.findById(id))
})

export default router;