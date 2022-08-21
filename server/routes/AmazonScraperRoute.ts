import express, { Request, Response, Router } from 'express';
import * as stream from 'stream';
import session from 'express-session';
import os from 'os';
import bodyParser from 'body-parser';

const router: Router = express.Router();
const { exec } = require('child_process');
const jsonParser = bodyParser.json();

const getDirectoryBasedOnSystem = () => {
  switch (os.platform()) {
    case 'win32':
      return '../amazonscraper';
    default:
      return 'amazonscraper';
  }
};

const runAProductScraper = async (
  req: Request,
  res: Response,
  command: string
) => {
  //Execute the command in the child process
  exec(
    command,
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
};

router.get('/id/:id', async (req: Request, res: Response) => {
  //Get the product id from the url
  const { id } = req.params;
  const command =
    'cd ' +
    getDirectoryBasedOnSystem() +
    ' & scrapy crawl AmazonOneProductSpider -a prod_id="' +
    id +
    '"';
  runAProductScraper(req, res, command);
});
router.get('/highres/id/:id', async (req: Request, res: Response) => {
  //Get the product id from the url
  const { id } = req.params;
  const command =
    'cd ' +
    getDirectoryBasedOnSystem() +
    ' & scrapy crawl AmazonGetHighResImages -a prod_id="' +
    id +
    '"';
  runAProductScraper(req, res, command);
});
router.get('/prices/id/:id', async (req: Request, res: Response) => {
  //Get the product id from the url
  const { id } = req.params;
  const command =
    'cd ' +
    getDirectoryBasedOnSystem() +
    ' & scrapy crawl AmazonProductPrices -a prod_id="' +
    id +
    '"';
  runAProductScraper(req, res, command);
});
router.get('/prices/array', jsonParser, async (req: Request, res: Response) => {
  const command =
    'cd ' +
    getDirectoryBasedOnSystem() +
    ' & scrapy crawl AmazonProductPrices -a string_of_many_prod_ids="' +
    req.session.user_favourites_product_ids +
    '"';
  runAProductScraper(req, res, command);
});
export default router;
