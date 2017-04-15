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
          templateUrl: 'templates/menu.html'
        }).
        
        when('/shop', {
            templateUrl: 'templates/shop.html'
          }).
          
          when('/shopdetail', {
              templateUrl: 'templates/shop-detail.html'
            }).
        
        otherwise({
          redirectTo: '/'
        });
        
  }]);
