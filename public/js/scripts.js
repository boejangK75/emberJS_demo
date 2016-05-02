var socketAnn = io('http://localhost:3000',{		
	'reconnect': true,
	'reconnection delay': 1000,
	'max reconnection attempts': 30,
	'secure': true,
	'transports':['websocket']
});

socketAnn.emit('enterRoom');

socketAnn.on('broadcastAnnouncement',function(result) {
	alert(result);
});
