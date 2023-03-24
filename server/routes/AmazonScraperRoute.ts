import express, { Request, Response, Router } from 'express';
import * as stream from 'stream';
import os from 'os';
import bodyParser from 'body-parser';

const router: Router = express.Router();
const { exec } = require('child_process');
const jsonParser = bodyParser.json();

const getDirectoryBasedOnSystem = () => {
  switch (os.platform()) {
    case 'win32':
      return '../amazonscraper &';
    default:
      return '& cd amazonscraper &&';
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
        res.status(500).json({
          status: 'error',
          message: "Couldn't scrap the files",
          logs: error.message,
        });
      } else {
        res.status(200).json({ status: 'ok', logs: stdout });
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
    ' scrapy crawl AmazonOneProductSpider -a prod_id="' +
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
    ' scrapy crawl AmazonGetHighResImages -a prod_id="' +
    id +
    '" -o AmazonGetHighResImages.json';
  runAProductScraper(req, res, command);
});
router.get('/prices/id/:id', async (req: Request, res: Response) => {
  //Get the product id from the url
  const { id } = req.params;
  const command =
    'cd ' +
    getDirectoryBasedOnSystem() +
    ' scrapy crawl AmazonProductPrices -a prod_id="' +
    id +
    '"';
  runAProductScraper(req, res, command);
});
router.get('/prices/', jsonParser, async (req: Request, res: Response) => {
  const command =
    'cd ' +
    getDirectoryBasedOnSystem() +
    ' scrapy crawl AmazonProductPrices -a fetch_prod_ids_from_db=True';
  runAProductScraper(req, res, command);
});
router.get('/reviews/id/:id', async (req: Request, res: Response) => {
  //Get the product id from the url
  const { id } = req.params;
  const command =
    'cd ' +
    getDirectoryBasedOnSystem() +
    ' scrapy crawl AmazonReviewsSpider -a prod_id="' +
    id +
    '"';
  runAProductScraper(req, res, command);
});

export default router;
