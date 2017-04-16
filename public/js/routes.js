///////////////////////////////////////////////////
//////////////////  Routes  ////////////////// //
//////////////////////////////////////////////////

pos.config(['$routeProvider',
  function($routeProvider) {

      $routeProvider.
        when('/', {
        	
          templateUrl: 'templates/home.html'
        }).
        
        when('/menu', {
          templateUrl: 'templates/menu.html',
          controller: 'inventoryController'
        }).
        
        when('/shop', {
            templateUrl: 'templates/shop.html'
          }).
          
          when('/shopdetail', {
              templateUrl: 'templates/shop-detail.html'
            }).
            
            when('/admin/product', {
                templateUrl: 'templates/inventory/create-product.html',
                controller: 'newProductController'
              }).
        
        otherwise({
          redirectTo: '/'
        });
        
  }]);
