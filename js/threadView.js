// Thread View custom element
// <thread-view tid="string" colors="colorsObject"></thread-view>
// Model of colorsObject: {primary: string, textOnPrimary: string, backgroundThread: string}

function threadView() {
    
    // For each instance, manipulates scope data, which the directive applies to the template.
    function controller($scope, $element, threads, users, viewManager, colors) {
        
        var controller = this; // Only needed for use in $scope.$watch below.
        
        var repositionBy;
        
        var scroller;
        
        var scrollButton = false;
        
        var scrollToBottom = false;
        
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
        
        var threadID = ""; // Will be manipulated in the refresh function
    
        // Get elements that will be modified in the code
        var titleEl = $element[0].querySelector(".threadView-title");
        var textBoxContentEl = $element[0].querySelector(".threadView-textBoxContent");
        var contentEl = $element[0].querySelector(".threadView-content");
        var scrollerEl = $element[0].querySelector(".threadView-scroller");
        var inputEl = $element[0].querySelector(".threadView-input");
        var inputButtonWrapperEl = $element[0].querySelector(".threadView-inputButtonWrapper");
        var scrollToBottomBarEl = $element[0].querySelector(".threadView-scrollToBottomBar");
        var inputBarEl = $element[0].querySelector(".threadView-inputBar");
        
        threads.addListener(this, "threadView");
        
        viewManager.elementReady('threadView', $element[0]);
        
        $scope.colors = colors;
        
        if (angular.isDefined($scope.colors.primary)) $scope.primaryColor = $scope.colors.primary;
        if (angular.isDefined($scope.colors.backgroundThread)) $scope.backgroundColor = $scope.colors.backgroundThread;
        if (angular.isDefined($scope.colors.textOnPrimary)) $scope.fontColor = $scope.colors.textOnPrimary;
        
        //$scope.barHeight = $element[0].querySelector(".threadView-exitButtonWrapper").offsetWidth + 'px';
        $scope.viewWidth = $element[0].offsetWidth;
        $scope.viewHeight = $element[0].offsetHeight;
        
        var shadowSize = $element[0].offsetWidth * .05 + "px";
        $scope.shadowStyle = {
            "box-shadow": "inset 0  " + shadowSize + " " + shadowSize + " -" + shadowSize + " rgba(0, 0, 0, 1),"
                        + "inset 0 -" + shadowSize + " " + shadowSize + " -" + shadowSize + " rgba(0, 0, 0, 1)"
        };
        
        $scope.$watch('threadID', function() {
            
            if ($scope.threadID) {
                
                scrollButton = false;
                scrollToBottom = false;
                
                controller.threadID = $scope.threadID;
                
                textBoxContentEl.textContent = threads.getDraft($scope.threadID);
                
                $scope.isGroup = threads.isGroup($scope.threadID);
                $scope.title = threads.getTitle($scope.threadID);
                $scope.clusters = getClusters($scope.threadID, 50);
                if (angular.isDefined($scope.colors.primary) && $scope.colors.primary == "user-colors")
                    $scope.primaryColor = threads.getColor($scope.threadID);
            }
        });
        
        
        $scope.backButton = function() {
            threads.saveDraft($scope.threadID, textBoxContentEl.textContent);
            textBoxContentEl.textContent = ""; // Clear the submission box.
            viewManager.closeThread();
            $scope.threadID = "";
            threadID = "";
        };
        
        // TODO; To be dynamically changed in the code.
        $scope.inputButtonURL = "img/android-send-hd.png";
        
        $scope.submitMessage = function() {
            scrollToBottom = true;
            var content = textBoxContentEl.textContent;
            if (content) {
                threads.sendMessage($scope.threadID, content);
                textBoxContentEl.textContent = ""; // Clear the submission box.
            }
        };
        
        this.newMessage = function(newMessage) {
            addToClusters($scope.clusters, newMessage);
        };
        
        $scope.onScrollerInit = function() {
            
            if (!angular.isDefined(scroller)) { // Used to ensure that this functionality is only run once.
                
                titleEl.style.fontSize = titleEl.offsetHeight + "px";
                
                var textBoxHeight = textBoxContentEl.offsetHeight * 0.4;
                textBoxContentEl.style.fontSize = textBoxHeight + 'px';
                contentEl.style.fontSize = textBoxHeight + 'px';
                
                scrollerEl.style.height = scrollerEl.offsetHeight + 'px';
                
                scroller = new IScroll(scrollerEl, scrollerConfig);
                
                // Scroll to the bottom, since users will want to see most recent messages
                scroller.scrollTo(0, scroller.maxScrollY, 0);
                
                // Behavior of bottom bar based on scroll position - when user scrolls up, replace input bar with button that automatically scrolls to the bottom
                
                scroller.on('scrollEnd', function () {
                    
                    if (this.y <= this.maxScrollY + scrollerEl.offsetHeight) {
                        if (scrollButton) {
                            newMessage = false;
                            removeScrollButton();
                        }
                    } else if (this.y >= this.maxScrollY) {
                        if (!scrollButton) revealScrollButton("Scroll to bottom");
                    } else if (scrollButton && !newMessage) {
                        removeScrollButton();
                    }
                });  
            }
            
            refresh();
        };
        
        $scope.scrollToBottom = function() {
            scroller.scrollTo(0, scroller.maxScrollY, 500);
        };
        
        function refresh() {
            if (angular.isDefined(scroller)) {
                var maxYBefore = scroller.maxScrollY;
                scroller.refresh();
                if (threadID == $scope.threadID) {
                    if (scrollToBottom || scroller.y <= maxYBefore) {
                        scrollToBottom = false;
                        scroller.scrollTo(0, scroller.maxScrollY, 1000);
                    } else revealScrollButton("New message! Tap to view");
                } else { // This will only run when a thread is being opened
                    threadID = $scope.threadID;
                    scroller.scrollTo(0, scroller.maxScrollY);
                    removeScrollButton();
                    viewManager.animationReady();
                }
            }
        }
        
        function removeScrollButton() {
            scrollButton = false;
            if (scroller.y == scroller.maxScrollY) { // Smooth animation scroll to very bottom of thread
                // smooth animation scroll
            } else { // Jump to correct scroll point so the user does not notice the change
                var scrollTo = scroller.y + (inputEl.offsetHeight - inputButtonWrapperEl.offsetHeight);
                scroller.scrollTo(0, scrollTo, 0);
            }
            scrollToBottomBarEl.style.zIndex = -1;
            //inputBarEl.style.height = "auto";
        }
        
        function revealScrollButton(buttonText) {
            if ($scope.scrollToBottomText != buttonText) {
                $scope.scrollToBottomText = buttonText; // Change the text
                $scope.$apply();
            }
            if (!scrollButton) {
                var scrollTo = scroller.y - (inputBarEl.offsetHeight - inputButtonWrapperEl.offsetHeight);
                scroller.scrollTo(0, scrollTo, 0);
                scrollToBottomBarEl.style.zIndex = 1;
                //inputBarEl.style.height = "18vw";
            }
            scrollButton = true;
        }
        
        // Gets message data and structures it in a way that is most presentable (by grouping each user's consecutive messages into clusters)
        function getClusters(threadID, howManyMessages, bottomOffset = 0) {
            
            // In a messenger application, the common way to present messages to the user is to group them by consecutive messages by a user (as opposed to presenting user identification next to each individual message).
            // In order to achieve this, we will arrange the message data to be organized in this way. Instead of a list of messages, we will organize the data into a list of groups containing each user's consecutive messages.
            // For clarity's sake, each user will likely be associated with many items (groups of messages) in the resulting list, but no user will be associated with two consecutive items in the list. 
            
            // howManyMessages is number of messages from the bottom of the thread are to be retrieved.
            // What's is considered "bottom" is by default the last message sent, but can be offset with the bottomOffset variable. If howManyMessages = 3 and offsetBottom = 2, the returned array will have the cluster(s) containing the third, fourth, and fifth messages from the bottom.
            // The entirety of all clusters containing relevant messages will be returned. So if howManyMessages = 5 and the two bottommost clusters each contain 4 messages, both clusters--totalling 8 messages-- will be returned. 
            
            // Returns as an object with properties in the following format: {
            //  *(dateTimeOfFirstMessage): {
            //      uid: either a string containing the uid of the account who posted the cluster of messages, or an empty string if it's a cluster of general activity notifications (missed calls or other interactions) rather than dialogue.
            //      messages: {
            //          *(dateTime): {
            //              content:
            //              dateTime:
            //          }
            //      } 
            //  }
            // }
            
            if (howManyMessages == 0) return {}; // If no messages need to be returned, we're already done here.
            
            var sortMessageArray = function(a, b) {
                var keyA = new Date(a.dateTime),
                    keyB = new Date(b.dateTime);
                if(keyA < keyB) return -1;
                if(keyA > keyB) return 1;
                return 0;
            }; // We will use this as an argument to an array's prototype sort function to make sure the messages are in chronological order by time sent
            
            function messageObjToArray(messages, messageArray = []) {
                for (messageKey in messages) messageArray.push(messages[messageKey]);
                return messageArray;
            }; // We will use this to translate the message data from objects with timeDate keys to enumerated arrays, so that we can iterate through the messages in a controlled order.
            // Model of returned message array: [
            //  *{
            //      uid: either a string containing the uid of the account who posted the message, or an empty string if it's a general activity notification (missed call or other interaction) rather than dialogue.
            //      content: If text, a string containing the text. If image, URL of the photo preceded by the prefix 'img:'
            //      dateTime:
            //  }
            // ]
            
            var baseMessages = threads.getMessages(threadID, howManyMessages, bottomOffset); // Get only the messages specified by the arguments
            
            if (baseMessages[0]) var baseMessagesArray = baseMessages; // If the object is already in array form (enumerated), then we can just go ahead and assign it to the array variable we'll be using...
            else var baseMessagesArray = messageObjToArray(baseMessages); // ... If not, we'll use the function we just defined to translate the object to an array.
            
            baseMessagesArray.sort(sortMessageArray); // Let's user the function we defined earlier to sort the initial set of messages, to make sure they're in chronological order by date sent
            
            var finalMessagesArray = []; // We'll go ahead and initialize the array that will ultimately contain the set of messages to be segregated into clusters
            
            // Now that we have an array of the initial set of messages, let's make sure we have the entire cluster of the chronologically earliest message.
            if (baseMessagesArray.length == howManyMessages) { // If the returnable amount of messages was as many as we requested, then we still have more to check. (If not, then we know for sure that we have the complete cluster of the earliest message.)
                var topUID = baseMessagesArray[0]; // Get the user ID of the chronologically earliest base message. We will try to match this with the user ID of immediately preceding messages to determine if there are more messages we need to get to complete the cluster.
                var messagesToAdd = []; // We will initialize an array to hold any messages that need to be added to complete the cluster of the earliest of the base messages
                for (var offset = 0, continueLoop = true; continueLoop; offset += 5) { // We will get five messages at a time, starting from the sent time of the earliest base message and approaching earlier until we either run out of messages or find a message that isn't by the same user as the earliest base message.
                    var moreMessages = threads.getMessages(threadID, 5, bottomOffset + howManyMessages + offset); // Get the five messages
                    if (moreMessages[0]) var moreMessagesArray = moreMessages; // If already in array form, assign it to the array variable we will be using...
                    else var moreMessagesArray = messageObjToArray(moreMessages, messagesToAdd); // ... Otherwise, use our function to translate the object into an enumerable array
                    moreMessagesArray.sort(sortMessageArray); // Make sure the messages are in chronological order
                    for (var i = moreMessagesArray.length - 1; (i >= 0) && continueLoop; i--) { // Iterate through the messages in reverse (from latest to earliest) and stop when we either run out of messages in the five or find a message that isn't by the same user as the earliest base message.
                        if (topUID == moreMessagesArray[i].uid) messagesToAdd.unshift(moreMessagesArray[i]); // If the message matches the user ID of the earliest base message (and thus belongs in its cluster), add it to the top of the array (using unshift so the array will be in chronological order)
                        else continueLoop = false; // If not, we have the full cluster and we're done. Set continueLoop to false so both loops will end after this iteration.
                    }
                }
                for (var i = 0; i < messagesToAdd.length; i++) finalMessagesArray.push(messagesToAdd[i]); // Add the messages we just pulled to the final array before we add the base messages, since they chronologically come first.
            }
            
            for (var i = 0; i < baseMessagesArray.length; i++) finalMessagesArray.push(baseMessagesArray[i]); // Now we'll add the initial messages to the final array. But it's still not finalized yet.
            // Note that the base messages are fully included in the final array now, so we can just use the final array in most operations that regard the base messages.
            
            // Now, since this function completes the cluster of the earliest base message by pulling messages before it, we should exclude the most recent base messages that are part of an incomplete cluster...
            // ... We do this so that when this function is called iteratively or to add to an existing set of clusters, there won't be duplicate clusters or messages...
            if (bottomOffset > 0) { // ... But we only need to do this if we don't already have the most recent message sent overall.
                var bottomUID = finalMessagesArray[finalMessagesArray.length - 1]; // Get the user ID of the chronologically most recent of the base messages. We will try to match this with the user ID of the immediately-following message to determine if the most recent base messages are part of another cluster.
                var messageBelow = threads.getMessages(threadID, 1, bottomOffset - 1); // Get the message immediately following the most recent of the base messages. Will be returned as either an array or an object, even though it will only contain one property.
                var messageBelowKey;
                for (messageKey in messageBelow) messageBelowKey = messageKey; // Use a for loop to figure out what the key to the object's data is. Will work regardless of whether the object is an array. Will only iterate once.
                if (bottomUID == messageBelow[messageBelowKey].uid) { // If the user ID of the chronologically most recent base message matches with that of the message immediately following it...
                    finalMessagesArray.pop(); // ...go ahead and remove the most recent base message. We know already that we won't need it.
                    for (var i = finalMessagesArray.length - 1, continueLoop = true; (i >= 0) && continueLoop; i--) { // Iterate through the final array in reverse order...
                        if (finalMessagesArray[i].uid == bottomUID) finalMessagesArray.pop(); // ...deleting any messages that match the user ID of the most recent base message.
                    } // Now that this is done, we have removed all messages part of a more recent cluster.
                }
            }
            
            // Now that we have the finalized array of messages, we must form the actual clusters.
            
            var clusters = []; // Initialize an object that will ultimately contain all of the clusters.
            
            // Before we proceed, let's check to make sure there are still messages to form into clusters. It's possible they were all removed.
            if (finalMessagesArray.length > 0) {
                
                for (var i = 1; i < finalMessagesArray.length; i++) addToClusters(clusters, finalMessagesArray[i]); // Once this is finished, all clusters have been created and added to the object of clusters.
                
                /* If using an object with dateTime keys is preferred to an enumerated array, enable the code below and disable the for loop immediate above.
                    // We will start with the first message.
                    var cluster = createCluster(0); // Let's use the above function to create our first cluster and add the first message to it.
                    var clusterKey = finalMessagesArray[0].dateTime; // Get the time sent of the first message in the first cluster so that we can later use it as a key
                    
                    // Now we will address the rest of the messages.
                    for (var i = 1; i < finalMessagesArray.length; i++) {
                        
                        if (cluster.uid == finalMessagesArray[i].uid) { // If the message's user ID matches the current cluster's...
                            cluster.messages[finalMessagesArray[i].dateTime] = {
                                content: finalMessagesArray[i].content,
                                dateTime: finalMessagesArray[i].dateTime
                            }; // ...add the message to the cluster.
                        } else { // The the message's user ID doesn't match the current cluster's...
                            clusters[clusterKey] = cluster; // ...this cluster is finished. Add it to the object of clusters by assigning it to the current cluster key.
                            cluster = createCluster(i); // Now let's move on to the next cluster and add this iteration's message to it.
                            clusterKey = finalMessagesArray[i].dateTime; // Now let's get the appropriate key for the new cluster.
                        }
                    } // Once this is finished, all clusters have been created and added to the object of clusters.
                    clusters[clusterKey] = cluster;
                */
            }
            
            return clusters;
        }
        
        // Currently only used in disabled code. Can be removed in final version if not used.
        // Here's a function we can use iteratively to create each individual cluster.
        function createCluster(index, newMessage) {
            // First create the new cluster
            var newCluster = { 
                uid: newMessage.uid,
                messages: {}
            };
            // Now let's add the first message to it.
            newCluster.messages[newMessage.dateTime] = {
                content: newMessage.content,
                dateTime: newMessage.dateTime
            };
            return newCluster;
        }
        
        function addToClusters(clusters, newMessage) {
            var cluster;
            if (clusters.length > 0) cluster = clusters[clusters.length - 1];
            if (!angular.isDefined(cluster) || cluster.uid != newMessage.uid) { // If the message's user ID matches the current cluster's...
                cluster = {
                    uid: newMessage.uid,
                    messages: {}
                };
                clusters.push(cluster);
            }
            cluster.messages[newMessage.dateTime] = {
                content: newMessage.content,
                dateTime: newMessage.dateTime
            }; // ...add the message to the cluster.
        }
    }
    
    // Specify properties of the directive
    return {
        restrict: 'E',
        scope: {
            threadID: '=tid'
        },
        controller: ['$scope', '$element', 'threads', 'users', 'viewManager', 'colors', controller],
        templateUrl: 'html/threadView.html'
    };
}


