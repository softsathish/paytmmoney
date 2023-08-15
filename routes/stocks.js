const express = require('express');
const router = express.Router();
const stocks = require('../services/stocks');

// router.get('/', async function(req, res, next) {
//     console.log('req', req.query);
//     try {
//       res.json(await stocks.getMultiple(req.query.page, req.query.search));
//     } catch (err) {
//       console.error(`Error while getting stocks `, err.message);
//       next(err);
//     }
//   });

module.exports = router;