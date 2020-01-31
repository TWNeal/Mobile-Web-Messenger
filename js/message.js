// Message custom element
// <message content="string" bg-color="{{string}}" font-color="{{string}}" repeat-complete="function" in-last-cluster="boolean"></message>

function message($timeout) {
    
    // Applied BEFORE transclusion and functionality attached to child elements
    function controller($scope) {
        
        var contentSplit = $scope.content.split("img:");
        
        if (contentSplit.length > 1) {
            $scope.isText = false;
            $scope.photoURL = contentSplit[1];
        }
        else {
            $scope.isText = true;
            $scope.text = $scope.content;
        }
        
    }
    
    // Applied AFTER transclusion and functionality attached to child elements
    function link(scope) {
        
        // Will run a function (repeatComplete) if provided after the ng-repeat finishes for all messages in all clusters.
        if (angular.isDefined(scope.repeatComplete) &&(scope.inLastCluster || !angular.isDefined(scope.inLastCluster)) && scope.$parent.$last)
            $timeout(scope.repeatComplete);
        
    }
    
    return {
        restrict: 'E',
        scope: {
            content: '=', // If text, a string containing the text. If image, URL of the photo preceded by the prefix 'img:'
            bgColor: '@',
            fontColor: '@',
            repeatComplete: '=', // Function to run after the ng-repeat directive is finished
            inLastCluster: '=' // Simple boolean indicating whether this message is contained in the last cluster. Expected to be left undefined if the given message is not contained in a cluster.
        }, 
        controller: ['$scope', controller],
        link: link,
        templateUrl: 'html/message.html'
    };
}

