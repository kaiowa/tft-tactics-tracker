require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var url=require('url');

const schedule = require('node-schedule');

var API=require('./includes/api');
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(helmet());
app.disable('x-powered-by');
//app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static( './static')); //Serves resources from public folder

var server = require('http').Server(app);
var io = require('socket.io')(server);


  
app.get('/', async function(req, res) {


    var queryData = url.parse(req.url, true).query;

    let userName=queryData.name;
    let style=queryData.style ?  queryData.style :'1';
    let user=await API.getUserBase(userName);
   

    user=user.data;
  
    
    res.render('index', {

        user:userName,
        userJson:JSON.stringify(user),
        style:style,
        static_path: 'static',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
    res.status(200).end;
});

io.on('connection', function(socket) {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on('room', async function(data) {
      
        let userActive=JSON.parse(data);
        let userBase=await API.getUserInfo(userActive.id);
        let lastMatch=await API.getPositions(userActive.puuid);

        let userCompleteData={
            'info':userBase.data[0],
            'matches':lastMatch
        }
        io.to(socket.id).emit('match', userCompleteData);
       
        var cronMatches = schedule.scheduleJob(process.env.cronMatches, async function(){
           
            let userBase=await API.getUserInfo(userActive.id);
            let lastMatch=await API.getPositions(userActive.puuid);
            let userCompleteData={
                'info':userBase.data[0],
                'matches':lastMatch
            }
            io.to(socket.id).emit('match', userCompleteData);
           
        });
       
    });
});
var port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log('Servidor corriendo en http://localhost:3000');
});