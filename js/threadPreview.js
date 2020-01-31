// Thread Preview custom element
// <thread-preview thread="threadObject" repeat-complete="function"></thread-preview>
// threadObject expects: {id: string/number, lastMessage: {uid: string, content: string, dateTime: number}}

function threadPreview($timeout) {
    
    function controller($scope, $element, threads, viewManager, colors) {
		//$scope.photoURL = threads.getImage($scope.threadID);
		$scope.image = threads.getThumbnail($scope.thread.id);
		$scope.name = threads.getTitle($scope.thread.id);
		
		$scope.colors = colors;
		
		if (angular.isDefined(colors.primary)) {
			if (colors.primary == "user-colors") {
				$scope.color = threads.getColor($scope.thread.id);
			} else $scope.color = colors.primary;
		} // else default to CSS
		
		$scope.onClick = function() {
			viewManager.openThread($scope.thread.id);
		};
		
		$scope.onThumbnailLoaded = onThumbnailLoaded;
		
		function onThumbnailLoaded() {
			
			var containerEl = $element[0].querySelector(".threadPreview-container");
			var nameEl = $element[0].querySelector(".threadPreview-name");
			var activityTextEl = $element[0].querySelector(".threadPreview-activityText");
			var infoEl = $element[0].querySelector(".threadPreview-info");
			var activityBackgroundEl = $element[0].querySelector(".threadPreview-activityBackground");
			
			var bgRadius = containerEl.offsetWidth * .02 + 'px';
			infoEl.style.borderRadius = containerEl.offsetWidth * .04 + 'px';
			activityBackgroundEl.style.borderRadius = "0 0 " + bgRadius + " " + bgRadius;
			
			nameEl.style.fontSize = (nameEl.offsetHeight * .8) + 'px';
			activityTextEl.style.fontSize = (activityTextEl.offsetHeight * .8) + 'px';
			
			// Will run a function (repeatComplete) if provided after the ng-repeat finishes for all messages in all clusters.
			if (angular.isDefined($scope.repeatComplete) && $scope.$parent.$last)
			$timeout($scope.repeatComplete);
		}
    }
    

    
    return {
	restrict: 'E',
	scope: {
	    thread: '=',
	    repeatComplete: '='
	}, 
	controller: ['$scope', '$element', 'threads', 'viewManager', 'colors', controller],
	templateUrl: 'html/threadPreview.html'
    };
}

