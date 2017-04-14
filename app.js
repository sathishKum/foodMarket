
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  ,publicPath 	= './public/';



var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.resolve('bower_components')))



app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname, publicPath, 'index.html'))
})
app.get('/menu', function (req, res) {
	res.sendFile(path.resolve(__dirname, publicPath, 'menu.html'))
});
app.get('/shop', function (req, res) {
	res.sendFile(path.resolve(__dirname, publicPath, 'shop.html'))
});
app.get('/shopdetail', function (req, res) {
	res.sendFile(path.resolve(__dirname, publicPath, 'shop-detail.html'))
});
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
