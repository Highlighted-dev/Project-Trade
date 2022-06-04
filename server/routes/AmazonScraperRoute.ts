import express, { Request, Response, Router } from 'express';
import * as stream from 'stream';
import session from 'express-session';
const router: Router = express.Router();

router.get('/id/:id', async (req: Request, res: Response) => {
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
        console.log(stdout);
        res.redirect(req.session.url || '/');
      }
    }
  );
});
router.get('/highres/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  /**
   * TODO: Run this only when theres no items with that id in database
   * */
  const { exec } = require('child_process'); //TODO: Change this to import
  exec(
    'cd ../amazonscraper & scrapy crawl AmazonGetHighResImages -a prod_id="' +
      id +
      '"',
    function (error: Error, stderr: stream.Readable, stdout: stream.Readable) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        console.log(stderr);
        console.log(stdout);
        res.redirect(req.session.url || '/');
      }
    }
  );
});

export default router;
