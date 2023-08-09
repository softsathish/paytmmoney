let WebSocketServer = require('ws');

const LivePriceWebSocket = require('./livePriceWebSocket.js');
let livePriceWebSocket = new LivePriceWebSocket();
jwt =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJtZXJjaGFudCIsImlzcyI6InBheXRtbW9uZXkiLCJpZCI6MzkzNjY1LCJleHAiOjE2OTE2MDU3OTl9.l4eR46PrUWQHIeqbCLOz9w_ojSr0vO2AcWsTZKx72sI'; // enter your public access token here


const wss = new WebSocketServer.WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
	console.log('new connection created');
	ws.on('message', function message(data) {
		console.log('received: %s', JSON.parse(data).map(obj => obj.scripId));
		livePriceWebSocket.setOnOpenListener(() => {
			livePriceWebSocket.subscribe(JSON.parse(data));
		});

		// this event gets triggered when connection is closed
		livePriceWebSocket.setOnCloseListener((code, reason) => {
			console.log(' disconnected Code: ' + code + ' Reason: ' + reason);
		});

		// this event gets triggered when response is received
		livePriceWebSocket.setOnMessageListener((arr) => {
            ws.send(JSON.stringify(arr));
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
