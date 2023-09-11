var express = require('express');
const cors = require('cors');
const app = express();

const stocksRouter = require('./routes/stocks');
const stocks = require('./services/stocks');
// app.use(express.json());
app.listen(8080);
app.use(express.static(__dirname));
app.use(
	cors({
		origin: '*',
	})
);
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.get('/', (req, res) => {
	res.json({ message: 'ok' });
});
app.get('/symbols', async function (req, res, next) {
	try {
		res.json(await stocks.getMultiple(req.query.page, req.query.search));
	} catch (err) {
		console.error(`Error while getting stocks `, err.message);
		next(err);
	}
});
app.get('/watchlist', async function (req, res, next) {
	try {
		res.json(await stocks.getWatchlist(req.body));
	} catch (err) {
		console.error(`Error while getting watchlist `, err.message);
		next(err);
	}
});
app.delete('/watchlist/:id', async function (req, res, next) {
	try {
		res.json(await stocks.deleteWatchlist(req.params.id));
	} catch (err) {
		console.error(`Error while deleting watchlist `, err.message);
		next(err);
	}
});
app.post('/addToWatchList', async function (req, res) {
	try {
		console.log('watchlist', req.body);
        res.json(await stocks.addToWatchList(req.body.watchList));
	} catch (err) {
		console.error(`Error while adding watchlist `, err.message);
		next(err);
	}
});
app.get('/positions', async function (req, res, next) {
	try {
		res.json(await stocks.getPositions(req.body));
	} catch (err) {
		console.error(`Error while getting position `, err.message);
		next(err);
	}
});
app.post('/addPosition', async function (req, res) {
	try {
        res.json(await stocks.addPosition(req.body));
	} catch (err) {
		console.error(`Error while adding position `, err.message);
		next(err);
	}
});
app.put('/positions/:id', async function (req, res, next) {
	try {
		res.json(await stocks.exitPosition(req.params.id));
	} catch (err) {
		console.error(`Error while exiting position `, err.message);
		next(err);
	}
});
/* Error handler middleware */
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	console.error(err.message, err.stack);
	res.status(statusCode).json({ message: err.message });
	return;
});