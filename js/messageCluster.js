// Message Cluster
// <message-cluster cluster="clusterObject" is=group="boolean" repeat-complete="function" colors="colorsObject"></message-cluster>
// Model of clusterObject: {
// 	"uid": string,
// 	"messages": {
// 		*dateTime: string
// 	}
// }
// Model of colorsObject: {primary: string, secondary: string, textOnPrimary: string, textOnSecondary: string}

function messageCluster($timeout) {

    function controller($scope, users, colors) {
        
        $scope.isMe = ($scope.cluster.uid == users.myUID);
        
        $scope.image = users.getThumbnail($scope.cluster.uid);
        
        if ($scope.isMe) {
            if (angular.isDefined(colors.secondary)) {
                $scope.color = colors.secondary;
            } // else default to CSS
            if (angular.isDefined(colors.textOnSecondary)) {
                $scope.fontColor = colors.textOnSecondary;
            } // else default to CSS
        } else {
            if (angular.isDefined(colors.primary)) {
                if (colors.primary == "user-colors") {
                    $scope.color = users.getColor($scope.cluster.uid);
                } else $scope.color = colors.primary;
            } // else default to CSS
            if (angular.isDefined(colors.textOnPrimary)) {
                $scope.fontColor = colors.textOnPrimary;
            } // else default to CSS
        }
        
        if (!$scope.isMe) $scope.name = users.getName($scope.cluster.uid);
        
        if ($scope.$parent.$last) $scope.isLastCluster = true;
        else $scope.isLastCluster = false;
        
    }

    return {
        restrict: 'E',
        scope: {
            cluster: '=', // See object structure of clusterObject below
            isGroup: '=', // If true, is a group chat. If false, is just a one-on-one chat.
            repeatComplete: '=' // Function to run after the repeat directives are finished
        },
        controller: ['$scope', 'users', 'colors', controller],
        templateUrl: 'html/messageCluster.html'
    };
}

