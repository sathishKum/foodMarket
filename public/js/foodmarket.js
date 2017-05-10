var pos = angular.module('foodmarket', [
  'ngRoute',
  'ngAnimate',
  'lr.upload',
  'ui.odometer',
]);


///////////////////////////////////////////////////
////////////////// Socket.io ////////////////// //
//////////////////////////////////////////////////

var serverAddress;

if (window.location.host === 'pos.dev')
  serverAddress = 'http://pos.dev'
else
  serverAddress = 'http://pos.afaqtariq.com:8080';

var socket = io.connect(serverAddress);


/////////////////////////////////////////////////////
////////////////// Controllers ////////////////// //
////////////////////////////////////////////////////

pos.controller('body', function ($rootScope, $scope, $location, Settings, Profile, Cart) {

  $scope.loginStatus = 'false';
  $scope.name = 'N/A';
  $scope.cart = null;

  

  $scope.onHomePage = function () {
    return ($location.path() === '/' || $location.path() === '#/');
  };


  // console.log("--");

  $scope.logout = function () {

    // alert(1)


    Profile.logout().then(function (res) {


      $scope.loginStatus = 'false';
      $scope.name = 'N/A';


      //  console.log(res);

      $location.path('/');


    });

  }

  //console.log('---->' + $rootScope.loginStatus)

  Profile.validatelogin().then(function (res) {
    //  alert(JSON.stringify(res));

    if (res !== 'undefined' && res !== 'unauthenticated') {

      $scope.loginStatus = 'true';
      $scope.name = res[0].name;

    }


    // console.log("dsfs--------->"+res);
  });

  Cart.getCart().then(function (res) {


    $scope.cart = res;

    console.log('---> cart ' + JSON.stringify(res));

  });

  $rootScope.$on('loginStatus', function (event, data) {
    $scope.name = 'sathish';
    $scope.loginStatus = data;
    console.log(data);
  });


  $rootScope.$on('cartUpdated', function (event, data) {
    
    if (data == 'true') {
      Cart.getCart().then(function (res) {
        $scope.cart = res;
        console.log(res);

      });
    }
  });

  Settings.get().then(function (settings) {
    $scope.settings = settings;
  });

});

// Inventory Section

pos.controller('inventoryController', function ($scope, $location, Inventory) {

  //alert(Inventory.getProducts())


  $scope.selectedProduct = 'empty';

  //alert($scope.selectedProduct)

  // get and set inventory
  Inventory.getAllProducts().then(function (products) {
    $scope.inventory = angular.copy(products);
    //al//ert("-- " + products)

    console.log(JSON.stringify(products))
  });



});

pos.controller('shopController', function ($rootScope, $scope, $location, Inventory, $routeParams, Cart) {

  //alert($routeParams.param)


  var productId = $routeParams.param;

  // get and set inventory
  Inventory.getProduct(productId).then(function (product) {
    $scope.inventory = angular.copy(product);
    //al//ert("-- " + products)

    console.log(JSON.stringify(product))
  });



  $scope.addtocart = function () {


    Cart.add(productId).then(function (res) {


      if (res == 'success') {
        $rootScope.$emit('cartUpdated', 'true');
      }



    });



    //  alert(JSON.stringify(productId));

  }



});



pos.controller('cartController',function($rootScope,$scope,Cart,$location,Profile){

  $scope.cart;
  $scope.productId;
  $scope.user;

  $scope.orderStatus = 'false';

  $scope.profile ;

  $scope.invoice ;


  Cart.viewOrder().then(function(res){

    console.log(JSON.stringify(res))
          $scope.invoice = res;
  });



  
  Profile.validatelogin().then(function (res) {
    //  alert(JSON.stringify(res));

    if (res === 'undefined' || res === 'unauthenticated') {

           $location.path('/login');

    }else{
      $scope.profile = res[0]._id;
    }


    // console.log("dsfs--------->"+res);
  });

  

  Cart.getCart().then(function (res) {


    $scope.cart = res;

    console.log('---> cart ' + JSON.stringify(res));

  });


  $scope.remove = function(productId){

    

     Cart.remove(productId).then(function(res){


       $scope.cart = res;

      $rootScope.$emit('cartUpdated', 'true');

  });

}

$scope.order = function(user){


  user.profile = $scope.profile;

  Cart.order(user).then(function(res){
    //alert(JSON.stringify(res));
    $scope.orderStatus = 'true';
    $rootScope.$emit('cartUpdated', 'true');

   // $location.hash('succDiv');

      // call $anchorScroll()
     // $anchorScroll();

  });

}

 
  
})


pos.controller('loginController', function ($rootScope, $scope, $location, Profile) {


  $scope.showform = 'login';

  $scope.status = 'initial';

  $scope.showLogin = function () {

    $scope.showform = 'login';
  }

  $scope.showRegister = function () {
    $scope.showform = 'register';
  }


  $scope.register = function (profile) {

    //alert(1)

    Profile.register(profile).then(function (data) {

      //alert(data)

      $scope.status = data;

    });



  }

  $scope.login = function (profile) {
    console.log("00 " + JSON.stringify(profile))
    Profile.login(profile).then(function (data) {

      $scope.status = data;

      console.log("fadf" + data);

      $rootScope.$emit('loginStatus', 'true');
      $rootScope.$emit('name', data[0].name);

      $location.path('/');

    });
  }


});

pos.controller('newProductController', function ($scope, $location, $route, Inventory) {

  $scope.addMultipleProducts = false;

  $scope.status = 'initial';


  Inventory.getCategoryList().then(function (products) {

    //alert(JSON.stringify(products));

    $scope.categories = angular.copy(products);
    // $scope.inventoryLastUpdated = new Date();
  });

  $scope.createProduct = function (product) {




    Inventory.createProduct($scope.newProduct).then(function (product) {

      if (product != null)
        $scope.status = 'Success';

    });

  };

  var refreshForm = function () {
    $scope.newProuct = {};
  };

});


pos.controller('newCategoryController', function ($scope, $location, $route, Inventory) {

  $scope.addMultipleProducts = false;

  $scope.status = 'initial';






  $scope.createCategory = function () {

    // alert(JSON.stringify($scope.newCategory))

    Inventory.createCategory($scope.newCategory).then(function (data) {
      //alert(JSON.stringify(data._id))
      if (data != null)
        $scope.status = 'Success';

    });

  };

  var refreshForm = function () {
    $scope.newCategory = {};
  };

});

pos.controller('editProductController', function ($scope, $location, $routeParams, Inventory, upload) {

  //alert(4)

  // get and set inventory
  Inventory.getProduct($routeParams.productId).then(function (product) {
    $scope.product = angular.copy(product);
  });

  $scope.saveProduct = function (product) {

    Inventory.updateProduct(product).then(function (updatedProduct) {
      console.log('updated!');
    });

    $location.path('/inventory');
  };

  $scope.deleteProduct = function () {
    Inventory.removeProduct($scope.product._id).then(function () {
      $location.path('/inventory');
    });
  };


  $scope.doUpload = function () {
    console.log('yoyoyo');

    upload({
      url: '/upload',
      method: 'POST',
      data: {
        anint: 123,
        aBlob: Blob([1, 2, 3]), // Only works in newer browsers
        aFile: $scope.product.image, // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
      }
    }).then(
      function (response) {
        console.log(response.data); // will output whatever you choose to return from the server on a successful upload
      },
      function (response) {
        console.error(response); //  Will return if status code is above 200 and lower than 300, same as $http
      }
      );
  }

});

// POS Section
pos.controller('posController', function ($scope, $location, Inventory, Transactions) {

  $scope.barcode = '';

  function barcodeHandler(e) {

    //alert($scope.product.name)

    $scope.barcodeNotFoundError = false;

    // if enter is pressed
    if (e.which === 13) {

      // if the barcode accumulated so far is valid, add product to cart
      if ($scope.isValidProduct($scope.barcode)) $scope.addProductToCart($scope.barcode);
      else
        console.log('invalid barcode: ' + $scope.barcode);
      // $scope.barcodeNotFoundError = true;

      $scope.barcode = '';
      $scope.$digest();
    }
    else {
      $scope.barcode += String.fromCharCode(e.which);
    }

  }

  $(document).on('keypress', barcodeHandler);

  var rawCart = {
    products: [],
    total: 0,
    total_tax: 0,
  };

  var startCart = function () {
    var cartJSON = localStorage.getItem('cart');

    if (cartJSON) {
      $scope.cart = JSON.parse(cartJSON);
    }
    else {
      $scope.cart = angular.copy(rawCart);
    }

  };

  var startFreshCart = function () {
    localStorage.removeItem('cart');
    $scope.cart = angular.copy(rawCart);
    $scope.updateCartTotals();
    $('#barcode').focus();
  };

  $scope.refreshInventory = function () {
    Inventory.getProducts().then(function (products) {
      $scope.inventory = angular.copy(products);
      $scope.inventoryLastUpdated = new Date();
    });
  };

  $scope.refreshInventory();

  startCart();

  var addProductAndUpdateCart = function (product) {
    $scope.cart.products = $scope.cart.products.concat([product]);
    $scope.updateCartTotals();
    $scope.barcode = '';
  };

  $scope.cleanProduct = function (product) {
    product.cart_item_id = $scope.cart.products.length + 1;

    if (product.food) product.tax_percent = 0;
    else product.tax_percent = .08;

    delete product.quantity_on_hand;
    delete product.food;
    return product;
  };

  var productAlreadyInCart = function (barcode) {
    var product = _.find($scope.cart.products, { barcode: barcode.toString() });

    if (product) {
      product.quantity = product.quantity + 1;
      $scope.updateCartTotals();
    }

    return product;
  };

  $scope.addProductToCart = function (barcode) {

    if (productAlreadyInCart(barcode)) return;
    else {
      var product = angular.copy(_.find($scope.inventory, { barcode: barcode.toString() }));
      product = $scope.cleanProduct(product);
      product.quantity = 1;
      addProductAndUpdateCart(product);
    }
  };

  $scope.addManualItem = function (product) {
    product.quantity = 1;
    product = $scope.cleanProduct(product)
    addProductAndUpdateCart(product);
  };

  $scope.removeProductFromCart = function (productIndex) {
    $scope.cart.products.remove(productIndex);
    $scope.updateCartTotals();
  };

  $scope.isValidProduct = function (barcode) {
    return _.find($scope.inventory, { barcode: barcode.toString() });
  };

  var updateCartInLocalStorage = function () {
    var cartJSON = JSON.stringify($scope.cart);
    localStorage.setItem('cart', cartJSON);
    socket.emit('update-live-cart', $scope.cart);
  };

  $scope.updateCartTotals = function () {
    $scope.cart.total = _.reduce($scope.cart.products, function (total, product) {
      var weightedPrice = parseFloat(product.price * product.quantity);
      var weightedTax = parseFloat(weightedPrice * product.tax_percent);
      var weightedPricePlusTax = weightedPrice + weightedTax;
      return total + weightedPricePlusTax;
    }, 0);

    $scope.cart.total_tax = _.reduce($scope.cart.products, function (total, product) {
      var weightedPrice = parseFloat(product.price * product.quantity);
      var weightedTax = parseFloat(weightedPrice * product.tax_percent);
      return total + weightedTax;
    }, 0);

    updateCartInLocalStorage();
  };

  $scope.printReceipt = function (payment) {
    // print receipt
    var cart = angular.copy($scope.cart);
    cart.payment = angular.copy(payment);
    cart.date = new Date();

    // save to database
    Transactions.add(cart).then(function (res) {

      socket.emit('cart-transaction-complete', {});

      // clear cart and start fresh
      startFreshCart();

    });

    $scope.refreshInventory();
  };

  $scope.addQuantity = function (product) {
    product.quantity = parseInt(product.quantity) + 1;
    $scope.updateCartTotals();
  };

  $scope.removeQuantity = function (product) {
    if (parseInt(product.quantity) > 1) {
      product.quantity = parseInt(product.quantity) - 1;
      $scope.updateCartTotals();
    }
  };

});

pos.controller('transactionsController', function ($scope, $location, Transactions) {

  Transactions.getAll().then(function (transactions) {
    $scope.transactions = _.sortBy(transactions, 'date').reverse();
  });

  // get yesterday's date
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  Transactions.getTotalForDay().then(function (dayTotal) {
    $scope.todayTotal = dayTotal.total;
  });

  Transactions.getTotalForDay(yesterday).then(function (dayTotal) {
    $scope.yesterdayTotal = dayTotal.total;
  });

  $scope.getNumberOfProducts = function (products) {
    return _.reduce(products, function (s, product) {
      return s + product.quantity;
    }, 0);
  };

});

pos.controller('viewTransactionController', function ($scope, $routeParams, Transactions) {

  var transactionId = $routeParams.transactionId;

  Transactions.getOne(transactionId).then(function (transaction) {
    $scope.transaction = angular.copy(transaction);
  });

});

pos.controller('liveCartController', function ($scope, Transactions, Settings) {

  $scope.recentTransactions = [];

  var getTransactionsData = function () {
    Transactions.get(10).then(function (transactions) {
      $scope.recentTransactions = _.sortBy(transactions, 'date').reverse();
    });

    Transactions.getTotalForDay().then(function (dayTotal) {
      $scope.dayTotal = dayTotal.total;
    });
  };

  // tell the server the page was loaded.
  // the server will them emit update-live-cart-display
  socket.emit('live-cart-page-loaded', { forreal: true });

  // update the live cart and recent transactions
  socket.on('update-live-cart-display', function (liveCart) {
    $scope.liveCart = liveCart;
    getTransactionsData();
    $scope.$digest();
  });

});
