// Profile Thumbnail custom element
// <profile-thumbnail image="string" dir="{{string}}" border-color="{{string}}"></profile-thumbnail>

function profileThumbnail() {
    
    function controller($scope, $element) {
	
		$scope.photoURL = $scope.image;
		
		if ($scope.direction == "left") $scope.otherDir = "right";
		else if ($scope.direction == "right") $scope.otherDir = "left";
		else console.log("Incorrect argument provided to a profileThumbnail component. Should be 'right' or 'left' but got '" + $scope.otherDir + "'.");
		
		//$scope.bottomAlignHeight = $element[0].querySelector(".profileThumbnail-circle").offsetWidth + 'px';
		
		var arrowSize = .14 * $element[0].offsetWidth;
		
		$scope.borderStyle = {};
		$scope.borderStyle['border-top'] = (2 * arrowSize + 'px') + ' solid transparent';
		$scope.borderStyle['border-bottom'] = (2 * arrowSize + 'px') + ' solid transparent';
		
		if ($scope.direction == "left") {
			$scope.borderStyle['border-right'] = (3 * arrowSize + 'px') + ' solid ' + $scope.borderColor;
		} else if ($scope.direction == "right") {
			$scope.borderStyle['border-left'] = (3 * arrowSize + 'px') + ' solid ' + $scope.borderColor;
		}
    }
    
    function link(scope, element) {
		element[0].querySelector(".profileThumbnail-bottomAlign").style.height = element[0].querySelector(".profileThumbnail-circle").offsetWidth + 'px';
		if (angular.isDefined(scope.onLoad)) scope.onLoad();
    }
    
    return {
		restrict: 'E',
		scope: {
			image: '=', // Image object of profile picture thumbnail to be displayed
			direction: '@dir', // Direction that the arrow is pointing. Can be "left" or "right"
			borderColor: '@',
			onLoad: '='
		},
		controller: ['$scope', '$element', controller],
		link: link,
		templateUrl: 'html/profileThumbnail.html'
    };
}

