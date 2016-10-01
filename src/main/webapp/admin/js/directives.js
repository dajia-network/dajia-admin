angular.module('dajiaAdmin.directives', []).directive('ngConfirmClick', [ function() {
	return {
		link : function(scope, element, attr) {
			var msg = attr.ngConfirmClick || "确定执行该操作吗?";
			var clickAction = attr.confirmedClick;
			element.bind('click', function(event) {
				if (window.confirm(msg)) {
					scope.$eval(clickAction)
				}
			});
		}
	};
} ]).directive('numberOnlyInput', function() {
	return {
		restrict : 'EA',
		template : '<input class="form-control" ng-model="inputValue" />',
		scope : {
			inputValue : '='
		},
		link : function(scope) {
			scope.$watch('inputValue', function(newValue, oldValue) {
				var arr = String(newValue).split("");
				if (arr.length === 0)
					return;
				if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.'))
					return;
				if (arr.length === 2 && newValue === '-.')
					return;
				if (isNaN(newValue)) {
					scope.inputValue = oldValue;
				}
			});
		}
	};
}).directive('myEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.myEnter);
				});

				event.preventDefault();
			}
		});
	};
});
