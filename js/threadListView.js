// Thread List View custom element
// <thread-list-view colors="colorsObject"></thread-list-view>
// Model of colorsObject: 

function threadListView() {
    
    function controller($scope, $element, threads, users, viewManager, colors) {
        
        this.newMessage = newMessage;
        this.newThread = newThread;
        
        $scope.colors = colors;

        if (angular.isDefined(colors.primary)) {
			if (colors.primary == "user-colors") {
                $scope.color = users.getColor(users.myUID);
			} else $scope.color = colors.primary;
		}// else default to CSS

        $scope.viewWidth = $element[0].offsetWidth;
        $scope.viewHeight = $element[0].offsetHeight;
        
        var scrollerConfig = { 
            scrollX: false,
            scrollY: true,
            scrollbars: false,
            useTransform: true, // if you dont use pinning, keep "useTransform" set to true, as it is far better in terms of performance.
            useTransition: false, // deativate css-transition to force requestAnimationFrame (implicit with probeType 3)
            probeType: 1, // Requires inclusion of iscroll-probe.js. Set to highest probing level to get scroll events even during momentum and bounce
            click: true, // pass through clicks inside scroll container
            mouseWheel: true,
        };
        
        var scrollerEl = $element[0].querySelector(".threadListView-scroller");
        
        var checks = [false];
        
        var threadIDs = threads.getThreads();
        var threadsObj = {}; // We will use this object to easily access and edit thread data via key (threadID).
        $scope.threads = []; // However the scope will hold the same data in array form so that it can be sorted by ng-repeat's orderBy functionality (see threadListView.html)
        for (j in threadIDs) {
            checks.push(false);
            var thumbnail = new Image();
            thumbnail.onload = markReady;
            thumbnail.src = threads.getThumbnail(threadIDs[j]);
            newThread(threadIDs[j]);
        }
        
        threads.addListener(this, "threadListView");
        
        // configure iScroll
        var scroller;
        
        $scope.onScrollerInit = onScrollerInit;

        var shadowSize = scrollerEl.offsetWidth * .05 + "px";
        $scope.shadowStyle = {
            "box-shadow": "inset 0  " + shadowSize + " " + shadowSize + " -" + shadowSize + " rgba(0, 0, 0, 1),"
                        + "inset 0 -" + shadowSize + " " + shadowSize + " -" + shadowSize + " rgba(0, 0, 0, 1)"
        };
        
        function markReady() {
            for (i in checks) {
                if (!checks[i]) {
                    checks[i] = true;
                    if (i == $scope.threads.length) viewManager.animationReady();
                    break;
                }
            }
        }
        
        function newMessage(threadID, newMessage) {
            threadsObj[threadID].lastMessage = withPrefix(newMessage);
            // TODO: display it as unread
        };
        
        function newThread(threadID) {
            var thread = {
                id: threadIDs[j],
                lastMessage: withPrefix(threads.getMessages(threadIDs[j], 1)[0])
            };
            threadsObj[threadIDs[j]] = thread;
            $scope.threads.push(thread);
        }
        
        function withPrefix(message) {
            // Text to summarize most recent activity, such as most recent message sent
            var prefix;
            if (message.uid == users.myUID) prefix = "You: ";
            else prefix = "";
            var uid = message.uid;
            var content = prefix + message.content;
            var dateTime = message.dateTime;
            return {
                uid: uid,
                content: content,
                dateTime: dateTime
            };
        }
        
        function onScrollerInit() {
            //
            var topBarTextEl = $element[0].querySelector(".threadListView-topBarText");
            topBarTextEl.style.fontSize = topBarTextEl.offsetHeight + "px";
            //
            var initializing = !angular.isDefined(scroller);
            if (initializing) scroller = new IScroll(scrollerEl, scrollerConfig);
            scroller.refresh();
            if (initializing) markReady();
        }
    }
    
    return {
        restrict: 'E',
        controller: ['$scope', '$element', 'threads', 'users', 'viewManager', 'colors', controller],
        templateUrl: 'html/threadListView.html'
    };
}


