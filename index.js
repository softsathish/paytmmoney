let WebSocketServer = require('ws');
require('./queries');

const wss = new WebSocketServer.WebSocketServer({ port: 3000 });

const LivePriceWebSocket = require('./livePriceWebSocket.js');
let livePriceWebSocket = new LivePriceWebSocket();
// enter your public access token here
jwt =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJtZXJjaGFudCIsImlzcyI6InBheXRtbW9uZXkiLCJpZCI6NTI2NzE2LCJleHAiOjE2OTU2NjY1OTl9.vINEpi9kDMoUJyLcBvf7RnN_OlX4qQshU4tVbo_2axI';

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

const clients = new Map();
wss.on('request', function (request) {
	if (!originIsAllowed(request.origin)) {
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log(
			new Date() + ' Connection from origin ' + request.origin + ' rejected.'
		);
		return;
	}
});

wss.on('connection', function connection(ws) {
	const id = uuidv4();
	console.log('new connection created', id);
	const metadata = { id };
	clients.set(ws, metadata);
	// ws.send('Connection success');
	ws.on('message', function message(data) {
		console.log(
			'received: %s',
			JSON.parse(data).map((obj) => obj.scripId)
		);
		const clientData = JSON.parse(data);
		const metadata = clients.get(ws);
		clientData.sender = metadata.id;
		livePriceWebSocket.setOnOpenListener(() => {
			livePriceWebSocket.subscribe(JSON.parse(data));
		});

		// this event gets triggered when connection is closed
		livePriceWebSocket.setOnCloseListener((code, reason) => {
			console.log(' disconnected Code: ' + code + ' Reason: ' + reason);
		});

		// this event gets triggered when response is received
		livePriceWebSocket.setOnMessageListener((arr) => {
			const outbound = JSON.stringify(arr);

			[...clients.keys()].forEach((client) => {
				client.send(outbound);
			});
		});

		// this event gets triggered when error occurs
		livePriceWebSocket.setOnErrorListener((err) => {
			console.log(err);
		});

		/**
		 *  set this config if reconnect feature is desired
		 * Set first param as true and second param, the no. of times retry to connect to server shall be made
		 */
		livePriceWebSocket.setReconnectConfig(true, 5);

		// this method is called to create a websocket connection with broadcast server
		livePriceWebSocket.connect(jwt); //pass public_access_token

		// To explicitly close websocket connection with server, call this method
		livePriceWebSocket.disconnect();

		// this method prints the response array received
		function printArray(arr) {
			console.log('data received from server: ');
			arr.forEach((obj) => {
				let tick = Object.keys(obj);
				tick.forEach((key) => {
					console.log(key + ':', obj[key]);
				});
				console.log('\n');
			});
		}
	});
	ws.on('close', () => {
		const metadata = clients.get(ws);
		console.log('closing connection', metadata.id);
		clients.delete(ws);
	});
});

// preference = {
// 	actionType: 'ADD', // 'ADD', 'REMOVE'
// 	modeType: 'LTP', // 'LTP', 'FULL', 'QUOTE'
// 	scripType: 'OPTION', // 'ETF', 'FUTURE', 'INDEX', 'OPTION', 'EQUITY'
// 	exchangeType: 'NSE', // 'BSE', 'NSE'
// 	scripId: '127619',
// };

// // create as many preferences as you like as shown above and append them in customerPreferences array

// customerPreferences.push(preference);

// // send preferences via websocket once connection is open
// livePriceWebSocket.setOnOpenListener(() => {
// 	livePriceWebSocket.subscribe(customerPreferences);
// });

// // this event gets triggered when connection is closed
// livePriceWebSocket.setOnCloseListener((code, reason) => {
// 	console.log(' disconnected Code: ' + code + ' Reason: ' + reason);
// });

// // this event gets triggered when response is received
// livePriceWebSocket.setOnMessageListener((arr) => {
// 	console.log(arr);
// });

// // this event gets triggered when error occurs
// livePriceWebSocket.setOnErrorListener((err) => {
// 	console.log(err);
// });

// /**
//  *  set this config if reconnect feature is desired
//  * Set first param as true and second param, the no. of times retry to connect to server shall be made
//  */
// livePriceWebSocket.setReconnectConfig(true, 5);

// // this method is called to create a websocket connection with broadcast server
// livePriceWebSocket.connect(jwt); //pass public_access_token

// // To explicitly close websocket connection with server, call this method
// livePriceWebSocket.disconnect();

// // this method prints the response array received
// function printArray(arr) {
// 	console.log('data received from server: ');
// 	arr.forEach((obj) => {
// 		let tick = Object.keys(obj);
// 		tick.forEach((key) => {
// 			console.log(key + ':', obj[key]);
// 		});
// 		console.log('\n');
// 	});
// }
