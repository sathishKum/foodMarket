var app 	= require('express')();
var server 	= require('http').Server(app);
var bodyParser = require('body-parser');
var Datastore = require('nedb');
var async = require('async');

var qs = require('querystring');
var cookieParser = require('cookie-parser');

var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'abcd1234';

app.use(cookieParser());

app.use(bodyParser.json());


module.exports = app;


var profileDB = new Datastore({ 
	filename: 'server/databases/profile.db', 
	autoload: true 
});



function encrypt(text){
	  var cipher = crypto.createCipher(algorithm,password)
	  var crypted = cipher.update(text,'utf8','hex')
	  crypted += cipher.final('hex');
	  return crypted;
	}


function decrypt(text){
	  var decipher = crypto.createDecipher(algorithm,password)
	  var dec = decipher.update(text,'hex','utf8')
	  dec += decipher.final('utf8');
	  return dec;
	}



var hashPassword = function (plainTextPassword) {
	var shasum=crypto.createHash('sha1');
	shasum.update(plainTextPassword);
	return (shasum.digest('hex'));
};

var isValidName = function (fullName) {
	var regex = /^[a-z ,.'-]+$/i;
	return regex.test(fullName);
	
};
 
var isEmail = function (email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
};

var addNewUser = function (name, emailid, password,response) {
	var user={'name': name, 'email': emailid , 'password': password};
	profileDB.insert(user, function (err, saved) {
  		if( saved ) {
  			response.send("saved");
			console.log("User  saved");
  		}

  		else{
  			
  			console.log("User not saved");
  			response.send("error");
  			
  		}
  			
	});

};


var validateUser = function (name, emailid, password, confirmPassword, request, response) {
	




	

	


	profileDB.find( { email: emailid }, function (err,user){
		
		console.log( user);

		if ( user.length > 0 ){
			response.send("exist");
		}else{

			response.cookie('ecommit_email', encrypt(emailid) , { expires: false } );
			var passwordHash = hashPassword(password);
			response.cookie('ecommit_passwordHash', passwordHash.toString(), { expires: false } );
			addNewUser(name, emailid, hashPassword(password),response);
			
		}

	});
	
	
};


var login = function(username,password,request,response){
	
	var passwordHash = hashPassword(password);
	
	var rememberMe = false;
	
	
	profileDB.find( { email: username }, function (err,user){
		
		if(typeof user === 'undefined' || user[0].password!==passwordHash) {
			console.log("dsafasasfdasfdsaf");
			response.send("error");
		}else {
			console.log(JSON.stringify(user))
			response.cookie('ecommit_email', encrypt(user[0].email) , { maxAge: (7 * 24 * 60 * 60 * 1000) });
			response.cookie('ecommit_passwordHash', user[0].password, { maxAge: (7 * 24 * 60 * 60 * 1000) });
			if(user.admin !== 'undefined'){

				response.cookie('reqauth', encrypt('admin'), { maxAge: (7 * 24 * 60 * 60 * 1000) });

			}
			response.send(user);
			//response.render(destination);
		
		}
		
		
	});
	
	
}


app.authenticateUser = function ( userCookie , callback  ){
	
	console.log("userCookie" + userCookie)

	var cookieData = cookieParser.JSONCookies(userCookie);
	if( ((typeof userCookie.ecommit_email)==='undefined') || ((typeof userCookie.ecommit_passwordHash)==='undefined') ) {
		//response.send('unauthenticated');
		//return false;

		callback('userNotFound',null);
	}
	else{
		var userEmail = decrypt(userCookie.ecommit_email);
		var passwordHash = userCookie.ecommit_passwordHash;


			profileDB.find( { email: { $in: [ userEmail ] } }, function(err,user){
				console.log(user);
				if(user.length <= 0 && user[0].password!==passwordHash){
					callback('userNotFound',null);
					//return false;
			}
			else{
				callback(null,user);
				//return true;
			}
		});
	}

};


var authenticateAndRender = function ( userCookie , response  ){
	
	//console.log("userCookie" + userCookie)

	var cookieData = cookieParser.JSONCookies(userCookie);
	if( ((typeof userCookie.ecommit_email)==='undefined') || ((typeof userCookie.ecommit_passwordHash)==='undefined') ) {
		response.send('unauthenticated');
		//return false;
	}
	else{
		var userEmail = decrypt(userCookie.ecommit_email);
		var passwordHash = userCookie.ecommit_passwordHash;


			profileDB.find( { email: { $in: [ userEmail ] } }, function(err,user){
				console.log(user);
				if(user.length <= 0 && user[0].password!==passwordHash){
					response.send('unauthenticated');
					//return false;
			}
			else{
				response.send(user);
				//return true;
			}
		});
	}

};


//app.authenticate = authenticateAndRender;



app.get('/loginInfo',function(request,response){
	
	
	var userCookie = request.cookies;
	
	authenticateAndRender(userCookie, response);
	
});




app.post('/addUser',function (request,response) {
	
	
	var post = request.body;
	
	
	validateUser(post.name, post.email , post.password, post.confirmPassword,request,response);
	
	


   
});


app.post('/login',function(request,response){
	
	var post = request.body;
	
	console.log(post)
	
	login(post.username,post.password,request,response);
	
});


app.get('/logout',function(request,response){
	
	response.clearCookie('ecommit_email');
	response.clearCookie('ecommit_passwordHash');
	response.send('success');
	
});





