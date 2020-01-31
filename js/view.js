// View custom element
// <view></view>

function view($compile, viewManager, colors, users, threads) {
    
    function link(scope, element) {
        
        this.elementReady = elementReady;
        this.animationReady = animationReady;
        this.openThread = openThread;
        this.closeThread = closeThread;
        
        var elements = {
            container: element[0].querySelector(".view-container"),
            splashScreen: element[0].querySelector(".view-splashScreen"),
            fadeToWhite: element[0].querySelector(".view-fadeToWhite")
        };
        
        var continueAnimation = { // Used to ensure animations run to completion uninterrupted. False if no transition is on-going; contains an object otherwise.
            run: fadeFrom,
            args: {
                elem: elements.fadeToWhite,
                seconds: 0.2
            }
        }; // Initialized with information to fade from the splash screen.
        
        viewManager.setView(this);
        
        users.init(function() {
            threads.init(function() {
                var container = angular.element(elements.container);
                container.append($compile('<thread-list-view colors="colors" class="view-threadListView"></thread-list-view>')(scope));
                container.append($compile('<thread-view tid="threadID" colors="colors" class="view-threadView"></thread-view>')(scope));
            });
        });
        
        //
        function elementReady(name, appendedEl) {
            // name parameter expects string with name to identify the particular element within the view template (the class name without the view- prefix)
            // appendedEl is an optional parameter that expects a raw element. If this is not provided, we will use the name provided to find the element.
            if (angular.isDefined(appendedEl)) elements[name] = appendedEl;
            else elements[name] = element[0].querySelector('.view-' + name);
        }
        
        // This function will be called twice during a transition between two views: once when the transition is at the point that neither view is visible, and once when the view being transitioned to has fully loaded. These two calls may happen in either order, but at least one (expectedly the former) needs to contain an argument object with a function that reveals the content as well as that function's appropriate arguments (use the continueAnimation initialization above as a guide for how this object should be formed).
        function animationReady(revealContent) {
            if (continueAnimation) {
                if (angular.isDefined(revealContent)) continueAnimation = revealContent;
                continueAnimation.run(continueAnimation.args);
                continueAnimation = false;
            } else if (angular.isDefined(revealContent)) continueAnimation = revealContent;
            else continueAnimation = true;
        }
        
        function openThread(threadID, color) {
            fadeTo(elements.fadeToWhite, onComplete, 0.2);
            function onComplete() {
                scope.threadID = threadID; // This will trigger the threadView to change, which will call fadeFromWhite when completed.
                scope.$apply();
                elements.threadView.style.zIndex = "2";
                animationReady({
                    run: fadeFrom,
                    args: {
                        elem: elements.fadeToWhite,
                        seconds: 0.2
                    }
                });
            }
        }
        
        function closeThread() {
            fadeTo(elements.fadeToWhite, onComplete, 0.2);
            animationReady();
            function onComplete() {
                elements.threadView.style.zIndex = "-1";
                animationReady({
                    run: fadeFrom,
                    args: {
                        elem: elements.fadeToWhite,
                        seconds: 0.3
                    }
                });
            }
        }
        
        function fadeTo(elem, onComplete, seconds = 0.3) {
            // elem is the element to which the transition will fade.
            // onCompleteExtra is the extra functionality to be run when the transition is finished
            // seconds is the number of seconds it takes for the fade transition to occur.
            elem.style.zIndex = "3";
            TweenMax.to(elem, seconds, { opacity: 1, onComplete: onComplete });
        }
        
        function fadeFrom(args) {
            // args.elem should contain the element to which the transition will fade.
            // args.seconds should contain the number of seconds it takes for the fade transition to occur.
            if (!angular.isDefined(args.seconds)) args.seconds = 0.3;
            TweenMax.to(args.elem, args.seconds, { opacity: 0, onComplete: onComplete });
            function onComplete() {
                args.elem.style.zIndex = "0";
            }
        }
    }
    
    return {
        restrict: 'EA',
        link: link,
        templateUrl: 'html/view.html'
    };
}

/* Expected data models

@colors: {
    primary, // Will default to CSS if not defined. If defined as "user-colors", will use colors associated with each specific user as defined in users.[uid].color
    secondary, // Will default to white if not defined.
    textOnPrimary, // Will default to white if not defined
    textOnSecondary, // Will default to black if not defined
    backgroundHome, // Will default to secondary if not defined
    backgroundThread // Will default to CSS background-color of .threadView-scroller if not defined
}

*/