///////////////////////////////////////////////////
//////////////////  Services  ////////////////// //
////////////////////////////////////////////////////

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

pos.service('Inventory', ['$http', function ($http) {

    var apiInventoryAddress = '/api/inventory';

    this.getAllProducts = function () {
    	
        return $http.get(apiInventoryAddress + '/products').then(function (res) {
        
          return res.data;
        });
    };
    
    
    

    this.getProduct = function (productId) {
        var url = apiInventoryAddress + '/product/' + productId;
        return $http.get(url).then(function (res) {
          return res.data;
        });
    };
    
    
    this.getCategoryList = function () {
        var url = apiInventoryAddress + '/categories/category';
        return $http.get(url).then(function (res) {
          return res.data;
        });
    };
    
    
    this.getProducts = function (productName) {
        var url = apiInventoryAddress + '/product/' + productName;
        return $http.get(url).then(function (res) {
          return res.data;
        });
    };

    this.updateProduct = function (product) {
        return $http.put(apiInventoryAddress + '/product', product).then(function (res) {
          return res.data;
        });
    };

    this.decrementQuantity = function (productId, quantity) {
      return $http.put(apiInventoryAddress + '/product', product).then(function (res) {
          return res.data;
        });
    };

    this.createProduct = function (newProduct) {
    	
    	
    	//alert(newProduct)
        return $http.post(apiInventoryAddress + '/product', newProduct).then(function (res) {
        	//alert(1)
          return res.data;
        });
    };
    
    
    this.createCategory = function (newCategory){
    	return $http.post(apiInventoryAddress + '/category',newCategory).then(function(res){
    		
    		 return res.data;
    		
    	});
    }

    this.removeProduct = function (productId) {
        return $http.delete(apiInventoryAddress + '/product/' + productId).then(function (res) {
          return res.data;
        });
    };

}]);


pos.service('Profile',['$http',function($http){
	
	var apiProfileAddress = '/api/user';
	
	this.register = function(profile){
		
		//alert(profile)
		
		return $http.post(apiProfileAddress+ '/addUser',profile).then(function(res){
			return res.data;
		});
		
	}
	
	
	this.logout = function(){
		return $http.get(apiProfileAddress+ '/logout').then(function(res){
			return res.data;
		});
		
	}
	
	this.login = function(profile){
		
		return $http.post(apiProfileAddress+ '/login' , profile).then(function(res){
			return res.data;
		});
	}
	
	this.validatelogin  =  function(){
		return $http.get(apiProfileAddress+ '/loginInfo' ).then(function(res){
			return res.data;
		});
	}
	
	
}]);

pos.service('Transactions', ['$http', function ($http, Inventory) {

    var transactionApiUrl = '/api/transactions/';

    this.getAll = function () {
        var url = transactionApiUrl + 'all';

        return $http.get(url).then(function (res) {
          return res.data;
        });
    };

    this.get = function (limit) {
        var url = transactionApiUrl + 'limit';

        return $http.get(url, { params: { limit: limit } }).then(function (res) {
          return res.data;
        });
    };

    this.getTotalForDay = function (date) {

        var url = transactionApiUrl + 'day-total';

        return $http.get(url, { params: { date: date } }).then(function (res) {
          return res.data;
        });
    };

    this.getOne = function (transactionId) {
        var url = transactionApiUrl + transactionId;

        return $http.get(url).then(function (res) {
          return res.data;
        });
    };

    this.add = function (transaction) {
        return $http.post(transactionApiUrl + 'new', transaction).then(function (res) {
          return res.data;
        });
    };

}]);

pos.service('Cart',['$http',function($http){
	
	
	var cartAPIUrl = '/api/cart';
	
	
	this.add = function(productId){
		
		
		return $http.get(cartAPIUrl + '/add/'+productId).then(function(res){
			
			console.log('returndata ---->'+res.data);
			return res.data;
			
		});
		
	}

  this.remove = function(productId){
    return $http.get(cartAPIUrl + '/remove/'+productId).then(function(res){
			
			console.log('returndata ---->'+res.data);
			return res.data;
			
		});
  }


  this.getCart = function(){
    return $http.get(cartAPIUrl + '/getCart').then(function(res){
      return res.data;
    });
  }

  this.order = function(user){

    return $http.post(cartAPIUrl + '/order',user).then(function(res){
      return res.data;
    });

  }
		
	this.viewOrder = function(){
    return $http.get(cartAPIUrl + '/getInvoice').then(function(res){
      return res.data;
    });
  }	
	
}]);

pos.service('Settings', ['$http', function ($http) {

    var settingsFile = 'settings.json';

    this.get = function () {
      return $http.get(settingsFile).then(function (res) {
        return res.data;
      });
    }

}]);