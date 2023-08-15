const config = {
	db: {
		/* don't expose password or any sensitive info, done only for demo */
		host: '68.178.145.180',
		user: 'mdstoxuser',
		password: 'Sathish123',
		database: 'mdstox',
		connectTimeout: 60000,
	},
	listPerPage: 100,
};
module.exports = config;
