import express, { Request, Response, Router } from "express";

const data = require('../../amazonscraper/file.json')
const router: Router = express.Router(); 

router.get('/',(req: Request,res: Response) => {
    res.json(data);
})

export default router;