var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pub = __dirname + '/static';
app.use(express.static(pub));

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var port = new SerialPort("/dev/tty.usbmodemfd121", 
	{
		baudrate: 9600,
		parser: serialport.parsers.readline("\n")
	}
);

var last;

port.on('data', function(line){
	try {
		var data = JSON.parse(line);
		// console.log("primer last: "+last+" actual: "+data.sensor);
		//if (data.sensor != last) {
			if (data.sensor == 51) {
				console.log(data.sensor);
			}else if(last == 51 && data.sensor != 51){
				console.log("push");
				io.emit('sensor', data.sensor);
			}
		//}
		last = data.sensor;
	} catch (e) {
		console.error(e);
	}
});

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(3000);