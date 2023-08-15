const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, searchVal = '') {
	const offset = helper.getOffset(page, config.listPerPage);
	const splitwords = searchVal.split(' ');
	const search = '+' + searchVal.split(' ').join('* +') + '*';
	const pagination = page ? `LIMIT ${offset},${config.listPerPage}` : '';
	const whereCondition = `WHERE MATCH(name) AGAINST ('${search}' IN BOOLEAN MODE )`;
	const query = `SELECT * 
FROM stocks ${searchVal ? whereCondition : ''} ${pagination}`;
	const rows = await db.query(query);

	const data = helper.emptyOrRows(rows);
	const meta = { page };

	return {
		data,
		meta,
	};
}

async function getWatchlist(page = 1) {
	const query = `SELECT * FROM WatchlistView order by filterID desc`;
	const rows = await db.query(query);

	const data = helper.emptyOrRows(rows);
	const meta = { page };

	return {
		data,
		meta,
	};
}

async function addToWatchList(watchlist) {
	const query = `INSERT INTO watchlist(security_id) values('${watchlist.security_id}')`;
    console.log('Query: ', query);
	const rows = await db.query(query);

	const data = helper.emptyOrRows(rows);
	const meta = { };

	return {
		data,
	};
}

async function deleteWatchlist(id) {
	const query = `Delete from watchlist where security_id = '${id}'`;
    console.log('Query: ', query);
	const rows = await db.query(query);

	const data = helper.emptyOrRows(rows);
	const meta = { };

	return {
		data,
	};
}

async function getPositions(page = 1) {
	const query = `SELECT * FROM OrdersView where status = 0 order by id desc`;
	const rows = await db.query(query);

	const data = helper.emptyOrRows(rows);
	const meta = { page };

	return {
		data,
		meta,
	};
}

async function addPosition(position) {
	const query = `INSERT INTO orders(security_id, quantity, boughtPrice) values(${position.security_id}, ${position.quantity}, ${position.boughtPrice})`;
    console.log('Query: ', query);
	const rows = await db.query(query);

	const data = helper.emptyOrRows(rows);
	const meta = { };

	return {
		data,
	};
}

async function exitPosition(id) {
	const query = `update orders set status = 1 where id = '${id}'`;
    console.log('Query: ', query);
	const rows = await db.query(query);

	const data = helper.emptyOrRows(rows);
	const meta = { };

	return {
		data,
	};
}

module.exports = {
	getMultiple,
    getWatchlist,
    addToWatchList,
    deleteWatchlist,
    getPositions,
    addPosition,
    exitPosition
};
