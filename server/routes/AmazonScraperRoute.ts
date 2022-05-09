import express, { Request, Response, Router } from 'express';
import * as stream from 'stream';
const router: Router = express.Router();

router.post('/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  /**
   * TODO: Run this only when theres no items with that id in database
   * */
  const { exec } = require('child_process'); //TODO: Change this to import
  exec(
    'cd ../amazonscraper & scrapy crawl AmazonOneProductSpider -a prod_id="' +
      id +
      '"',
    function (error: Error, stderr: stream.Readable, stdout: stream.Readable) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        console.log(stderr);
        res.status(200).send(stdout);
      }
    }
  );
});

export default router;
