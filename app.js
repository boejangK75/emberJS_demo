var ConfigsMain = require('./configs/config-root'),
express = require('express'),
jade = require('jade'),
http = require('http'),
socketIo = require('socket.io'),
mongoose = require('mongoose');

/**
* !@OBJECTS Init the objects
*/
var app = express(),
server = http.createServer(app),
io = socketIo.listen(server);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if ('OPTIONS' == req.method) {
      res.send(200);
    }else {
      next();
    }
};

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + "/public"));
});

server.listen(ConfigsMain.appPort, ConfigsMain.appIp, function() {
	console.log("SERVER START listening on port " + ConfigsMain.appPort);
});

/**========================================================================= DB CONNECTIONS =========================================================================
//========================================================================== DB CONNECTIONS =========================================================================*/
mongoose.connect(ConfigsMain.dbConnectionPath, ConfigsMain.mongooseOptions);
var Models = require('./models/model-root');

/**========================================================================= PATH CONFIGURATION =========================================================================
//========================================================================== PATH CONFIGURATION =========================================================================*/
app.get('/clientView', function(req, res) {
	res.render("clientView");
});

app.get('/locations', function(req, res) {
	var query = Models.AnnouncementsModel.find();
	query.exec(function(err,announcementsResults) {
		if(err){
			console.log(new Date()+', FROM /getAllAnouncements, ###ERROR : ' + err);
			res.send({'locations' : []});
		}else{
            res.send({'locations' : announcementsResults});
		}
	});
});

app.get('/locations/:id', function(req, res) {
	Models.AnnouncementsModel.findOne({
		'_id' : req.params.id
	},function(err, result) {
		if (err){
			console.log(new Date()+', FROM Find One, ###ERROR : ' + err);
			res.json({'location' : {}});
		}else {
			res.json({'location' : result});
		}
	});
});

app.post('/locations', function(req, res) {	
	var thisObjectSaved = req.body.location;
	var newAnn = new Models.AnnouncementsModel({
		'name' : thisObjectSaved.name,
		'duration' : thisObjectSaved.duration,
		'priority' : thisObjectSaved.priority,
		'value' : thisObjectSaved.value
	});
	newAnn.save(function(err,dataSave) {
		if (err){
			console.log(new Date()+', FROM Save, ###ERROR : ' + err);
			res.json({'location' : {}});
		}else{
			//Broadcast announcement to player site
            io.to('room1').emit('broadcastAnnouncement',thisObjectSaved.value);
            
            res.json({'location' : dataSave});
		}
	});
});

app.put('/locations/:id', function(req, res) {
	var thisObjectUpdated = req.body.location;
	Models.AnnouncementsModel.update({
		'_id' : req.params.id
	},{
		$set: {
			'name' : thisObjectUpdated.name,
			'duration' : thisObjectUpdated.duration,
			'priority' : thisObjectUpdated.priority,
			'value' : thisObjectUpdated.value
		}
	},function(err, result) {
		if (err){
			console.log(new Date()+', FROM UPDATE, ###ERROR : ' + err);
			res.json({'location' : {}});
		}else{
			//Broadcast announcement to player site
            io.to('room1').emit('broadcastAnnouncement',thisObjectUpdated.value);
            
			res.json({'location' : result});
		}
	});
});

app.delete('/locations/:id', function(req, res) {
	Models.AnnouncementsModel.remove({
		'_id' : req.params.id
	}, function(err) {
		if (err){
			console.log(new Date()+', FROM DELETE, ###ERROR : ' + err);
		}
		res.json({});
	});
});

/**
 * @Description	: called when the io is connected
 * @param 		: {object} socket 
 */
io.on('connection', function (socket) {
	socket.on('enterRoom',function() {
		if (socket.room)
			socket.leave(socket.room);
		socket.room = 'room1';
		socket.join('room1');
	});
});