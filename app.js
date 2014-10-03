var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pub = __dirname + '/static';
app.use(express.static(pub));

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var port = new SerialPort("/dev/tty.usbserial-A9007WoZ", 
	{
		baudrate: 9600,
		parser: serialport.parsers.readline("\n")
	}
);

port.on('data', function(line){
	var data = JSON.parse(line);
	var last = data.sensor;
	//console.log("primer last: "+last+" actual: "+data.sensor);
	//if (data.sensor != last) {
		if (data.sensor < 30 && data.sensor >15) {
			//console.log("push");
			io.emit('sensor', data.sensor);
		}
	//}
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