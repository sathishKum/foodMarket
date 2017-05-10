var app 	= require('express')();
var server 	= require('http').Server(app);
var bodyParser = require('body-parser');
var Datastore = require('nedb');
var async = require('async');

var profileModule = require('./userManagement');
var inventoryModule = require('./inventory');

var qs = require('querystring');
var cookieParser = require('cookie-parser');

var session = require('express-session');
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'abcd1234';

app.use(cookieParser());





app.use(session({secret: 'arrrahmo'}));
app.use(bodyParser.json());


module.exports = app;


  var Cart = function(object) {
    for(var name in object) {
      this[name] = object[name];
    }
  }


var cartDB = new Datastore({ 
	filename: 'server/databases/cart.db', 
	autoload: true 
});


// var inventoryDB = new Datastore({ 
// 	filename: 'server/databases/inventory.db', 
// 	autoload: true 
// })


var invoiceDB = new Datastore({ 
	filename: 'server/databases/invoice.db', 
	autoload: true 
})



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


var create = function(callback) {
	cartDB.insert({
        status: 'active'
      , items: []
      , created_on: new Date()
      , modified_on: new Date()
    }, function(err, result) {
      console.log('--------->'+JSON.stringify(result));
      if(err) return callback(err);
      callback(null, new Cart(result));
    });
  }


var findActiveByHexId = function(id, callback) {
	
	console.log('findActiveByHexId'+ JSON.stringify(id));
	
	cartDB.find({
		_id : id,
		status : 'active'
	}, function(err, doc) {

   console.log('inside hex'+ JSON.stringify(doc));
		if (err)
			return callback(err);
		if (doc == null)
			return callback(null, null);
		return callback(null, doc[0]);
	});
}



var createOrRetrieveCart = function createOrRetrieveCart(id, callback) {
	  if(id == null) {
	    // No cart associated with session yet
	    create(callback);
	  } else {
	    // Attempt to locate the cart and create a new one if there is none
	    findActiveByHexId(id, function(err, cart) {
        console.log('---> line 110'+JSON.stringify(cart))
	      if(err) return callback(err);
	      if(cart == null || cart == 'undefined') return create(callback);
        
	      callback(null, cart);
	    });
	  }
	}



var update = function(productId, quantity,cart, callback) {
    var self = cart;
    // Ensure correct types for parameters
  //  productId = typeof productId == 'string' ? new ObjectID(productId) : productId;
   // quantity = typeof quantity == 'string' ? parseInt(quantity, 10) : quantity;
    
    // Old quantity
    var oldQuantity = 0;

    var price  = cart.price;

    var productPrice = 0.0;

    // Save the current quantity in the cart
    for(var i = 0; i < cart.items.length; i++) {
      if(cart.items[i].product_id == productId) {
        oldQuantity = cart.items[i].quantity;
        productPrice = cart.items[i].price;
        break;
      }
    }

    // Calculate the new delta we are trying to reserve
    var delta = quantity - oldQuantity;

    console.log('delta quantity' + quantity);

    // If we have a negative delta, we are returning items to the store
    if(quantity == 0) return self.remove(productId, callback);

    // Update the quantity in the cart
    inventoryModule.getInventory(productId , function(err, product) {
      cartDB.update({
        _id: self._id, status: 'active'
      }, {
          $set: {price: Number(price) + Number(product.price), modified_on: new Date()}
        , $pull: {
          
          items: {
              product_id: productId
          }
        }, $push: {
          
          items: {
              product_id: productId
            , quantity: quantity
            ,name:product.name
            ,price:Number(productPrice) + Number(product.price)
          }
        }
      }, {upsert:true}, function(err, n) {
        if(err) return callback(err);
        if(n == 0) return callback(new Error(f("no cart found for %s", self._id)));
      callback(null, null);
    });
  });
  }




var add = function(productId, quantity, cart, callback){

  console.log(JSON.stringify(cart.items))

    var self = cart;

    var price  = cart.price;

    if(price == null){
      price = 0.0;
    }

    // Create ObjectId
   // productId = typeof productId == 'string' ? new ObjectID(productId) : productId;
    //quantity = typeof quantity == 'string' ? parseInt(quantity, 10) : quantity;

    console.log(productId + '<----productId')
   

    // Go through the items and see if we already have this product in the list
    // we need to update the quantity instead of adding a new row
     for(var i = 0; i < cart.items.length; i++) {
       if(cart.items[i].product_id == productId) {
          console.log(cart.items[0].product_id + '<----quantity')
         var newQuantity = cart.items[i].quantity + quantity;
         return update(productId, newQuantity,cart, callback);
       }
     }

    // Fetch the product information
     inventoryModule.getInventory(productId , function(err, product) {
      if(err) return callback(err);

      // First add the item to the cart
      cartDB.update({
        _id: self._id, status: 'active'
      }, {
          $set: {price: Number(price) + Number(product.price), modified_on: new Date()}
        , $push: {
          
          items: {
              product_id: productId
            , quantity: quantity
            ,name:product.name
            ,price:product.price
          }
        }
      }, {upsert:true}, function(err, n) {
        if(err) return callback(err);
        if(n == 0) return callback(new Error(f("no cart found for %s", self._id)));
      callback(null, null);
      });      
    });
  
}

var remove = function(productId,cart,callback){

  var self = cart;

  var price  = cart.price;

    if(price == null){
      price = 0.0;
    }

    var productPrice = 0.0;

         for(var i = 0; i < cart.items.length; i++) {
       if(cart.items[i].product_id == productId) {
         // console.log(cart.items[0].product_id + '<----quantity')


         productPrice = cart.items[i].price;
         
       }
     }

      inventoryModule.getInventory(productId ,  function(err, product) {
      if(err) return callback(err);

      // First add the item to the cart
      cartDB.update({
        _id: self._id, status: 'active'
      }, {
          $set: {price: Number(price) - Number(productPrice), modified_on: new Date()}
        , $pull: {
          
          items: {
              product_id: productId
          }
        }
      }, {upsert:true}, function(err, n) {
        if(err) return callback(err);
        if(n == 0) return callback(new Error(f("no cart found ")));
      callback(null, null);
      });      
    });
}



app.get('/getCart',function(req,res){


var userCookie = req.cookies;

var cookieData = cookieParser.JSONCookies(userCookie);


  console.log(userCookie.cartId)

  createOrRetrieveCart(cookieData.cartId, function(err,cart){
    res.cookie('cartId', cart._id, { maxAge: (7 * 24 * 60 * 60 * 1000) });
    res.send(cart);

  });

});


app.get('/remove/:productId',function(request,response){
  var id = request.params.productId;

  var userCookie = req.cookies;
  
  var cookieData = cookieParser.JSONCookies(userCookie);

  console.log('inside remove' + id);

  createOrRetrieveCart(cookieData.cartId, function(err, cart) {
	    if(err) throw err;


    console.log('--->226'+  JSON.stringify(cart));

	    // Update the cartId
	    userCookie.cartId = cart._id;

     remove(id,cart, function(err, result) {
	     
	      // We have an error, render the product view with the error
	      if(err) request.params.error = err;
	      // Add to list of items
	      request.params.id = id;

	      // Render the product view
	       createOrRetrieveCart(userCookie.cartId.cartId, function(err,cart){

            response.cookie('cartId', cart._id, { maxAge: (7 * 24 * 60 * 60 * 1000) });

           response.send(cart);

           });
	    });

  });



});


var createInvoice = function(fields,cart, callback) {
    var errors = {};
    // Fields cannot be empty
    if(fields.name.length == 0) errors.name = 'Recipients name must be filled in';
    if(fields.address.length == 0) errors.address = 'Address must be filled in';
    if(Object.keys(errors).length > 0) return callback(errors, null);
    
   

    // Create the invoice
    invoiceDB.insert({
      // Items in the order
        items: cart.items
      , created_on: new Date()
      // Shipping address
      , shipped_to: {
          name: fields.name
        , email:fields.email
        , address: fields.address
      },
      profile: fields.profile
      // Total price of order
      , total: cart.price
    }, function(err, result) {
      if(err) return callback(err);
      return callback(null, result);
    });
  }


app.post('/order',function(req,res){

  var userCookie = req.cookies;
  
  
  var cookieData = cookieParser.JSONCookies(userCookie);


    var fields = {
        email: req.body.email
      , name: req.body.name
      , address: req.body.address
      ,profile: req.body.profile
    }


  createOrRetrieveCart(cookieData.cartId, function(err, cart) {
	    if(err) throw err;

      createInvoice(fields, cart,function(err,invoice){

        response.clearCookie('cartId');
        res.send(invoice);

      });

  });



});



app.get('/add/:productId',function(req,response){

  console.log('inside add' + req.params.productId);
	var userCookie = req.cookies;
	// Product id
	  var id = req.params.productId;
	  var quantity = req.body.quantity || 1;
	  var err = new Error("not enough quantity available in inventory");
	  
	  console.log(userCookie.cartId)
	  // Get a cart
	  createOrRetrieveCart(userCookie.cartId, function(err, cart) {
	    if(err) throw err;


    console.log('--->226'+  JSON.stringify(cart));

	    // Update the cartId
	   // userCookie.cartId = cart._id;

      response.cookie('cartId', cart._id, { maxAge: (7 * 24 * 60 * 60 * 1000) });

	    // Add Product by id
	    add(id, quantity,cart, function(err, result) {
	     
	      // We have an error, render the product view with the error
	      if(err) req.params.error = err;
	      // Add to list of items
	      req.params.id = id;

	      // Render the product view
	       response.send("success");
	    });
	  });
	  
	  
	  
	
});


app.get('/getInvoice',function(req,res){


  var userCookie = req.cookies;
  
  var cookieData = cookieParser.JSONCookies(userCookie);


  profileModule.authenticateUser(userCookie, function(err,user){
 if(err) res.send("unauthenticated");

console.log('err' + JSON.stringify(err));    
console.log('user' + JSON.stringify(user));

    invoiceDB.find( { profile: user[0]._id }, function (err,invoice){

      console.log(JSON.stringify(invoice));

      res.send(invoice);

    });



  })



});