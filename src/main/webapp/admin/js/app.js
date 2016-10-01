angular.module(
		'dajiaAdmin',
		[ 'ui.bootstrap', 'ngRoute', 'flow', 'textAngular', 'ui.grid', 'dajiaAdmin.controllers',
				'dajiaAdmin.directives' ]).config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/products', {
		cache : false,
		templateUrl : './templates/products.html',
		controller : 'ProductsCtrl'
	}).when('/orders', {
		cache : false,
		templateUrl : './templates/orders.html',
		controller : 'OrdersCtrl'
	}).when('/clients', {
		cache : false,
		templateUrl : './templates/clients.html',
		controller : 'ClientsCtrl'
	}).when('/sales', {
		cache : false,
		templateUrl : './templates/sales.html',
		controller : 'SalesCtrl'
	}).when('/stats', {
		cache : false,
		templateUrl : './templates/stats.html',
		controller : 'StatsCtrl'
	}).when('/product/:pid', {
		cache : false,
		templateUrl : './templates/productDetail.html',
		controller : 'ProductDetailCtrl'
	}).when('/order/:orderId', {
		cache : false,
		templateUrl : './templates/orderDetail.html',
		controller : 'OrderDetailCtrl'
	}).when('/client/:userId', {
		cache : false,
		templateUrl : './templates/clientDetail.html',
		controller : 'ClientDetailCtrl'
	}).when('/sales/:userId', {
		cache : false,
		templateUrl : './templates/salesDetail.html',
		controller : 'SalesDetailCtrl'
	}).when('/login', {
		cache : false,
		templateUrl : './templates/login.html',
		controller : 'SignInCtrl'
	}).otherwise('/products')
} ]).service('authInterceptor', function($q) {
	var service = this;
	service.responseError = function(response) {
		if (response.status == 401) {
			window.location.href = '#/login';
		}
		return $q.reject(response);
	};
}).config([ '$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
} ]).config([ 'flowFactoryProvider', function(flowFactoryProvider) {

	flowFactoryProvider.defaults = {
		target : '/upload',
		permanentErrors : [ 404, 500, 501 ],
		testChunks : false
	};
} ]);