angular.module('dajiaAdmin.controllers', []).controller('ProductsCtrl', function($scope, $http, $route, $timeout) {
	console.log('ProductsCtrl...');
	$scope.syncBtnTxt = '同步数据';
	$scope.keyword = {
		value : ''
	};
	$scope.loadPage = function(pageNum) {
		console.log($scope.keyword);
		$http.post('/admin/products/' + pageNum, $scope.keyword).success(function(data, status, headers, config) {
			$scope.pager = data;
			$scope.products = data.results;
			$scope.gridOptions.data = $scope.products;
		}).error(function(data, status, headers, config) {
			console.log('request failed...');
		});
	}
	$scope.loadPage(1);
	$scope.gridOptions = {
		rowHeight : 50,
		appScope : $scope,
		columnDefs : ColumnDefs.productGridDef
	};
	$scope.sync = function() {
		$scope.alerts = [];
		$scope.syncBtnTxt = '进行中...';
		$http.get('/admin/sync/').success(function(data, status, headers, config) {
			console.log(data);
			$scope.syncBtnTxt = '同步数据';
			$scope.alerts.push({
				type : 'success',
				msg : '同步数据成功'
			});
			$timeout(function() {
				$route.reload();
			}, 1000);

		}).error(function(data, status, headers, config) {
			console.log('request failed...');
			$scope.alerts.push({
				type : 'danger',
				msg : '同步数据失败'
			});
		});
	};
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	$scope.bot = function(pid) {
		$scope.alerts = [];
		$http.get('/admin/robotorder/' + pid).success(function(data, status, headers, config) {
			$scope.alerts.push({
				type : 'success',
				msg : '机器打价成功'
			});
			$timeout(function() {
				$route.reload();
			}, 1000);
		}).error(function(data, status, headers, config) {
			console.log('request failed...');
			$scope.alerts.push({
				type : 'danger',
				msg : '机器打价失败'
			});
		});
	}
	$scope.addProduct = function() {
		window.location.href = '#/product/0';
	}
	$scope.editProduct = function(pid) {
		window.location.href = '#/product/' + pid;
	};
	$scope.delProduct = function(pid) {
		$http.get('/admin/product/remove/' + pid).success(function(data, status, headers, config) {
			window.location = '#';
		}).error(function(data, status, headers, config) {
			console.log('request failed...');
		});
	};
}).controller('OrdersCtrl', function($scope, $http) {
	console.log('OrdersCtrl...');
	$scope.orderFilter = {
		type : 'real',
		status : -1
	};
	$scope.loadPage = function(pageNum) {
		$http.post('/admin/orders/' + pageNum, $scope.orderFilter).success(function(data, status, headers, config) {
			// console.log(data);
			$scope.pager = data;
			$scope.orders = data.results;
			$scope.gridOptions.data = $scope.orders;
		}).error(function(data, status, headers, config) {
			console.log('request failed...');
		});
	}
	$scope.loadPage(1);
	$scope.gridOptions = {
		rowHeight : 50,
		appScope : $scope,
		columnDefs : ColumnDefs.orderGridDef
	};
	$scope.viewOrder = function(orderId) {
		window.location.href = '#/order/' + orderId;
	}
})

.controller('ClientsCtrl', function($scope, $http) {
	console.log('ClientsCtrl...');
	$scope.keyword = {
		value : ''
	};
	$scope.editUser = function(userId) {
		window.location.href = '#/client/' + userId;
	}
	$scope.loadPage = function(pageNum) {
		$http.post('/admin/users/' + pageNum, $scope.keyword).success(function(data, status, headers, config) {
			console.log(data);
			$scope.pager = data;
			$scope.users = data.results;
			$scope.gridOptions.data = $scope.users;
		}).error(function(data, status, headers, config) {
			console.log('request failed...');
		});
	}
	$scope.loadPage(1);
	$scope.gridOptions = {
		rowHeight : 50,
		appScope : $scope,
		columnDefs : ColumnDefs.clientGridDef
	};
})

.controller('SalesCtrl', function($scope, $http) {
	console.log('SalesCtrl...');
	$scope.editUser = function(userId) {
		window.location.href = '#/sales/' + userId;
	}
	$scope.loadPage = function(pageNum) {
		$http.get('/admin/sales/' + pageNum).success(function(data, status, headers, config) {
			console.log(data);
			$scope.pager = data;
			$scope.salesmen = data.results;
			$scope.gridOptions.data = $scope.salesmen;
		}).error(function(data, status, headers, config) {
			console.log('request failed...');
		});
	}
	$scope.loadPage(1);
	$scope.gridOptions = {
		rowHeight : 50,
		appScope : $scope,
		columnDefs : ColumnDefs.salesGridDef
	};
})

.controller('StatsCtrl', function($scope, $http) {
	console.log('StatsCtrl...');
	$scope.loadPage = function(pageNum) {
		$http.get('/admin/stats/' + pageNum).success(function(data, status, headers, config) {
			console.log(data);
			$scope.pager = data;
			$scope.salesmen = data.results;
			$scope.gridOptions.data = $scope.salesmen;
		}).error(function(data, status, headers, config) {
			console.log('request failed...');
		});
	}
	$scope.loadPage(1);
	$scope.gridOptions = {
		rowHeight : 50,
		appScope : $scope,
		columnDefs : ColumnDefs.statsGridDef
	};
	$scope.viewOrder = function(orderId) {
		window.location.href = '#/order/' + orderId;
	}
})

.controller(
		'ProductDetailCtrl',
		function($scope, $http, $routeParams, $route, $window) {
			console.log('ProductDetailCtrl...');
			$scope.descImages = [];
			$http.get('/admin/product/' + $routeParams.pid).success(function(data, status, headers, config) {
				// console.log(data);
				$scope.newSold = null;
				$scope.newPrice = null;
				var product = data;
				if (null == product.startDate) {
					product.startDate = new Date();
				} else {
					product.startDate = new Date(product.startDate);
				}
				product.startDate.setSeconds(0);
				product.startDate.setMilliseconds(0);
				if (null == product.expiredDate) {
					product.expiredDate = new Date();
				} else {
					product.expiredDate = new Date(product.expiredDate);
				}
				product.expiredDate.setSeconds(0);
				product.expiredDate.setMilliseconds(0);
				if (null == product.fixTop) {
					product.fixTop = 0;
				}
				$scope.product = product;
			}).error(function(data, status, headers, config) {
				console.log('request failed...');
			});

			$scope.go2Kdt = function(refId) {
				window.location.href = 'https://koudaitong.com/v2/showcase/goods/edit#id=' + refId;
			};
			$scope.addPrice = function() {
				$scope.alerts = [];
				if (!$scope.product.stock || !$scope.product.originalPrice) {
					$scope.formIncomplete();
				} else {
					if (null != $scope.newSold && $scope.newSold != 0 && null != $scope.newPrice
							&& $scope.newPrice != 0) {
						var priceObj = {
							sold : $scope.newSold,
							targetPrice : $scope.newPrice
						};
						if (null == $scope.product.prices) {
							$scope.product.prices = [];
						}
						$scope.product.prices.push(priceObj);
						$http.post('/admin/product/' + $routeParams.pid, $scope.product).success(
								function(data, status, headers, config) {
									var pid = data.productId;
									window.location.href = '#/product/' + pid;
								}).error(function(data, status, headers, config) {
							console.log('product update failed...');
							console.log(data.message);
						});
					}
				}
			};
			$scope.removePrice = function(priceId) {
				if (!$scope.product.stock || !$scope.product.originalPrice) {
					$scope.formIncomplete();
				} else {
					for (var i = $scope.product.prices.length - 1; i >= 0; i--) {
						if ($scope.product.prices[i].priceId == priceId) {
							$scope.product.prices.splice(i, 1);
						}
					}
					$http.post('/admin/product/' + $routeParams.pid, $scope.product).success(
							function(data, status, headers, config) {
								$route.reload();
							}).error(function(data, status, headers, config) {
						console.log('product update failed...');
						console.log(data.message);
					});
				}
			}
			$scope.republish = function() {
				$http.get('/admin/product/' + $routeParams.pid + '/republish').success(
						function(data, status, headers, config) {
							console.log(data);
							var product = data;
							$window.location.reload();
						});
			}
			$scope.submit = function() {
				$scope.alerts = [];
				console.log($scope.product);
				if (!$scope.product.name || !$scope.product.postFee || !$scope.product.stock
						|| !$scope.product.originalPrice || !$scope.product.startDate || !$scope.product.expiredDate
						|| !$scope.product.prices || $scope.product.prices.length == 0) {
					$scope.formIncomplete();
				} else {
					if ($scope.product.isPromoted == 'Y') {
						$scope.product.buyQuota = 1;
					}
					$http.post('/admin/product/' + $routeParams.pid, $scope.product).success(
							function(data, status, headers, config) {
								window.location = '#';
							}).error(function(data, status, headers, config) {
						console.log('product update failed...');
					});
				}
			}
			$scope.formIncomplete = function() {
				$scope.alerts.push({
					type : 'danger',
					msg : '缺少必填项'
				});
			}
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			}

			$scope.homeImgUploader = {};
			$scope.homeImgUpload = function() {
				$scope.homeImgUploader.flow.upload();
			}
			$scope.otherImgUploader = {};
			$scope.otherImgUpload = function() {
				$scope.otherImgUploader.flow.upload();
			}
			$scope.descImgUploader = {};
			$scope.descImgUpload = function() {
				$scope.descImgUploader.flow.upload();
			}
			$scope.homeImgUploadSuccess = function($message) {
				console.log($message);
				$scope.product.imgUrl = $message;
			}
			$scope.imgOrder = 0;
			$scope.otherImgUploadSuccess = function($message) {
				console.log($message);
				if (null == $scope.product.productImages) {
					$scope.product.productImages = [];
				}
				var productImg = {
					url : $message,
					thumbUrl : $message,
					sort : $scope.imgOrder
				};
				$scope.product.productImages.push(productImg);
				$scope.imgOrder += 1;
			}
			$scope.descImgUploadSuccess = function($message) {
				console.log($message);
				$scope.descImages.push($message);
				console.log($scope.descImages);
			}
			$scope.homeImgDelete = function() {
				if (null != $scope.homeImgUploader.flow.files) {
					$scope.homeImgUploader.flow.files.forEach(function(f) {
						f.cancel();
					});
				}
				$scope.product.imgUrl = null;
			}
			$scope.otherImgDelete = function() {
				if (null != $scope.otherImgUploader.flow.files) {
					$scope.otherImgUploader.flow.files.forEach(function(f) {
						f.cancel();
					});
				}
				$scope.product.productImages = null;
				$scope.imgOrder = 0;
			}
			$scope.descImgDelete = function() {
				if (null != $scope.descImgUploader.flow.files) {
					$scope.descImgUploader.flow.files.forEach(function(f) {
						f.cancel();
					});
				}
				$scope.descImages = [];
			}
			$scope.switchImgOrder = function(imgId) {
				if (null != $scope.product.productImages) {
					for (i = 0; i < $scope.product.productImages.length; i++) {
						var current = $scope.product.productImages[i];
						var next = $scope.product.productImages[i + 1];
						if (current.imgId == imgId) {
							var tmp = {
								url : null,
								thumbUrl : null,
								sort : null
							};
							tmp.url = current.url;
							tmp.thumbUrl = current.thumbUrl;
							current.url = next.url;
							current.thumbUrl = next.thumbUrl;
							next.url = tmp.url;
							next.thumbUrl = tmp.thumbUrl;
							break;
						}
					}
				}
			}
		})

.controller(
		'OrderDetailCtrl',
		function($scope, $http, $routeParams, $route, $window) {
			console.log('OrderDetailCtrl...');
			$scope.order = {};
			$scope.logisticAgents = [ {
				code : 'tiantian',
				name : '天天快递'
			}, {
				code : 'shunfeng',
				name : '顺丰快递'
			}, {
				code : 'zhongtong',
				name : '中通快递'
			}, {
				code : 'shentong',
				name : '申通快递'
			}, {
				code : 'yunda',
				name : '韵达快递'
			} ];
			$http.get('/admin/order/' + $routeParams.orderId).success(
					function(data, status, headers, config) {
						$scope.order = data;
						// console.log($scope.order);
						$scope.checkLogisticUrl = "http://m.kuaidi100.com/index_all.html?type=" + data.logisticAgent
								+ "&postid=" + data.logisticTrackingId + "&callbackurl=" + $window.location.protocol
								+ "//" + $window.location.host + window.location.pathname;
					}).error(function(data, status, headers, config) {
				console.log('request failed...');
			});
			$scope.deliverOrder = function(orderId) {
				$scope.alerts = [];
				if (!$scope.order.logisticTrackingId || !$scope.order.logisticAgent) {
					$scope.missLogistic();
				} else {
					$http.get('/admin/order/' + $routeParams.orderId + '/deliver', {
						params : {
							lti : $scope.order.logisticTrackingId,
							la : $scope.order.logisticAgent
						}
					}).success(function(data, status, headers, config) {
						$scope.order = data;
						console.log($scope.order);
						$route.reload();
					}).error(function(data, status, headers, config) {
						console.log('request failed...');
					});
				}
			}
			$scope.finishOrder = function(orderId) {
				$http.get('/admin/order/' + $routeParams.orderId + '/finish').success(
						function(data, status, headers, config) {
							$scope.order = data;
							console.log($scope.order);
							$route.reload();
						}).error(function(data, status, headers, config) {
					console.log('request failed...');
				});
			}
			$scope.closeOrder = function(orderId) {
				$http.get('/admin/order/' + $routeParams.orderId + '/close').success(
						function(data, status, headers, config) {
							$scope.order = data;
							$route.reload();
						}).error(function(data, status, headers, config) {
					console.log('request failed...');
				});
			}
			$scope.reopenOrder = function(orderId) {
				$http.get('/admin/order/' + $routeParams.orderId + '/reopen').success(
						function(data, status, headers, config) {
							$scope.order = data;
							$route.reload();
						}).error(function(data, status, headers, config) {
					console.log('request failed...');
				});
			}
			$scope.addComments = function(orderId) {
				$scope.alerts = [];
				if (!$scope.order.comments && !$scope.order.adminComments) {
					$scope.missComments();
				} else {
					$http.get('/admin/order/' + $routeParams.orderId + '/comments', {
						params : {
							comments : $scope.order.comments,
							adminComments : $scope.order.adminComments
						}
					}).success(function(data, status, headers, config) {
						$scope.order = data;
						console.log($scope.order);
						$route.reload();
					}).error(function(data, status, headers, config) {
						console.log('request failed...');
					});
				}
			}
			$scope.missLogistic = function() {
				$scope.alerts.push({
					type : 'danger',
					msg : '请填写快递相关信息'
				});
			}
			$scope.missComments = function() {
				$scope.alerts.push({
					type : 'danger',
					msg : '请填写备注信息'
				});
			}
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			}
		})

.controller('ClientDetailCtrl', function($scope, $http, $routeParams, $route, $window) {
	console.log('ClientDetailCtrl...');
	$http.get('/admin/user/' + $routeParams.userId).success(function(data, status, headers, config) {
		$scope.user = data;
		console.log($scope.user);
	}).error(function(data, status, headers, config) {
		console.log('request failed...');
	});
	$scope.save = function() {
		$http.post('/admin/user/' + $routeParams.userId, $scope.user).success(function(data, status, headers, config) {
			$route.reload();
		}).error(function(data, status, headers, config) {
			console.log('product update failed...');
		});
	}
})

.controller('SalesDetailCtrl', function($scope, $http, $routeParams, $route, $window) {
	console.log('SalesDetailCtrl...');
	$http.get('/admin/salesdetail/' + $routeParams.userId).success(function(data, status, headers, config) {
		$scope.user = data;
		console.log($scope.user);
	}).error(function(data, status, headers, config) {
		console.log('request failed...');
	});
})

.controller('SignInCtrl', function($scope, $rootScope, $http, $window, $timeout, $q) {
	$scope.login = {
		'mobile' : null,
		'signinCode' : null
	};
	$scope.alerts = [];
	$scope.smsBtnTxt = '发送手机验证码';
	$scope.smsBtnDisable = false;
	var smsBtn = angular.element(document.querySelector('#smsBtn'));

	var checkMobile = function(mobile) {
		var defer = $q.defer();
		$http.get('/signupCheck/' + mobile).success(function(data, status, headers, config) {
			if ("failed" == data.result) {
				defer.resolve(true);
			} else {
				$scope.alerts.push({
					type : 'danger',
					msg : '该手机号未被绑定，请先用微信登录后再绑定手机'
				});
				defer.resolve(false);
			}
		}).error(function(data, status, headers, config) {
			console.log('request failed...');
			defer.reject();
		});
		return defer.promise;
	}

	$scope.getSigninCode = function() {
		var mobile = $scope.login.mobile;
		var mobileReg = /^((13[0-9]|15[0-9]|18[0-9])+\d{8})$/;

		if (!mobile || mobile.length != 11 || !mobileReg.test(mobile)) {
			$scope.alerts.push({
				type : 'danger',
				msg : '请输入正确的手机号码'
			});
			return;
		}
		checkMobile(mobile).then(function(mobileValid) {
			if (mobileValid) {
				sendSmsMessage($scope, $http, $timeout, '/signinSms/', mobile);
			}
		});
	}

	$scope.submit = function() {
		if (!$scope.login.mobile || !$scope.login.signinCode) {
			$scope.alerts.push({
				type : 'danger',
				msg : '请输入完整信息'
			});
			return;
		}

		$http.post('/smslogin', $scope.login).success(function(data, status, headers, config) {
			if (data == null || data.length == 0 || data.isAdmin != 'Y') {
				$scope.loginFail();
			} else {
				$scope.alerts.push({
					type : 'success',
					msg : '登录成功'
				});
				window.location.href = "#";
			}
		}).error(function(data, status, headers, config) {
			$scope.loginFail();
		});

	};
	$scope.loginFail = function() {
		$scope.alerts.push({
			type : 'danger',
			msg : '登录失败。密码错误或没有管理员权限'
		});
	}
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	}
});

var sendSmsMessage = function($scope, $http, $timeout, methodPath, mobile) {
	var counter = 30;
	var onTimeout = function() {
		counter--;
		if (counter == 0) {
			$scope.smsBtnTxt = '发送手机验证码';
			$scope.smsBtnDisable = false;
			return false;
		}
		$scope.smsBtnTxt = '发送手机验证码 (' + counter + ')';
		mytimeout = $timeout(onTimeout, 1000);
	}
	var mytimeout = $timeout(onTimeout, 1000);
	$scope.smsBtnDisable = true;

	$http.get(methodPath + mobile).success(function(data, status, headers, config) {
		if ("success" == data.result) {
			$scope.alerts.push({
				type : 'success',
				msg : '验证码已发送'
			});
		} else {
			$scope.alerts.push({
				type : 'danger',
				msg : '验证码发送失败'
			});
		}
	}).error(function(data, status, headers, config) {
		console.log('request failed...');
	});
}