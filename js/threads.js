function threads(dataManager, users) {
    
    // Notes regarding documentation:
    // When you see an * (asterisk) before an item in an object model, it means there may be multiple of that object on the same hierarchical level
    // In an object model, when you see a key in parentheses (usually preceded by an asterisk), it means each object following that model will have a unique key 
    
    this.init = init;
    this.addListener = addListener;
    this.getThreads = getThreads;
    this.getMessages = getMessages;
    this.sendMessage = sendMessage;
    this.saveDraft = saveDraft;
    this.getDraft = getDraft;
    this.getParticipants = getParticipants;
    this.getColor = getColor;
    this.getThumbnail = getThumbnail;
    this.getFullImage = getFullImage;
    this.getTitle = getTitle;
    this.isGroup = isGroup;
    
    var data = {};
    
    var listeners = {}; // Collection of listeners to notify when there is a new message for the user.
    
    // Initializes relevent thread data. It is required that the users service is initialized fully before this function is run.
    function init(callback) {
        // callback parameter expects function with no parameters.
        dataManager.load('threads', function(threads) {
            data = threads;
            var threadIDs = users.getThreads();
            for (i in threadIDs) listenForNewMessages(threadIDs[i]);
            users.listenForNewThreads(getMessages(threadIDs[threadIDs.length - 1], 1)[0].dateTime + 1, function(key, threadID) {
                dataManager.download('threads/' + threadID, function(thread) {
                    data[threadID] = thread;
                    listenForNewMessages(threadID, function(index, message) {
                        messageReceived(threadID, message);
                    });
                    var participants = otherParticipants(threadID);
                    var downloaded = [];
                    for (j in participants) downloaded.push(false);
                    for (j in participants) users.downloadUser(participants[j], function() {
                        downloaded[j] = true;
                        for (k in downloaded) {
                            if (downloaded[k]) {
                                if (k == downloaded.length - 1) users.addThread(threadID);
                            } else break;
                        }
                    });
                    listenForNewParticipants(threadID, function(timeStamp, participantUID) {
                        users.downloadUser(participantUID, function() {
                            participantAdded(threadID, participantUID, timeStamp);
                            listenForNewMessages(threadID, function(index, message) {
                                messageReceived(threadID, message);
                            }, participantUID, false);
                        });
                    });
                });
            });
            if (angular.isDefined(callback)) callback();
        });
    }
    
    // Function for adding listeners from other parts of the app.
    function addListener(controller, id = "") {
        listeners[id] = controller;
    }
    
    function getThreads() {
        return users.getThreads(); // returns array of thread IDs of the threads that the user is participating in
    }
    
    function getMessages(threadID, howMany, bottomOffset = 0) {
        
        // howMany is number of messages from the bottom of the thread are to be retrieved. 
        // What's is considered "bottom" is by default the last message sent, but can be offset with the bottomOffset variable. If howMany = 3 and offsetBottom = 2, the returned array will have the third, fourth, and fifth messages from the bottom.
        // Unlike getClusters, this function returns individual messages.
        
        // Returns as an array of objects in the following format: [
        //  *{
        //      uid: either a string containing the uid of the account who posted the message, or an empty string if it's a general activity notification (missed call or other interaction) rather than dialogue.
        //      content: If text, a string containing the text. If image, URL of the photo preceded by the prefix 'img:'
        //      dateTime: 
        //  }
        // ]
        
        // TODO:
        // first check to see if any new posts in the thread since the last time this app checked
        // go ahead and pull new messages and place them into the database
        // pull remaining messages from db needed to get to howMany, or reduce size of object to only encompass the last howMany messages
        
        var messages;
        if (angular.isDefined(data[threadID])) messages = data[threadID].messages;
        else messages = [];
        
        if (messages.length < howMany) return messages; //howMany = messages.length;
        
        var returnThis = [];
        for (var i = messages.length - 1; i >= (messages.length - howMany); i--) {
            returnThis.unshift(messages[i]);
        }
        return returnThis;
    }
    
    //
    function messageReceived(threadID, message) {
        dataManager.save('threads/' + threadID + '/messages', message, true);
        data[threadID].messages.push(message);
        notifyListeners(threadID, newMessage); // notify the main threadView and threadListView to update display
    }
    
    function sendMessage(threadID, content) {
        var newMessage = {
            uid: users.myUID,
            content: content,
            dateTime: dataManager.timeStamp()
        };
        data[threadID].messages.push(newMessage);
        dataManager.store('threads/' + threadID + '/messages', newMessage, function() {
            // TODO: mark message as successfully sent. Haven't thought through the best way to implement this yet.
        }, true);
        notifyListeners(threadID, newMessage); // notify the main threadView and threadListView to update display
    }
    
    // Saves a draft written for a given thread to local storage. (Not necessary to include in online database.)
    function saveDraft(threadID, draft) {
        // draft parameter expects a string with the content of the draft.
        if (!angular.isDefined(data[threadID].draft) || (data[threadID].draft != draft)) {
            data[threadID].draft = draft;
            dataManager.save('threads/' + threadID + '/draft', draft);
        }
    }
    
    // Loads draft from internal storage to memory (if not already), and includes the loaded draft in a callback.
    function getDraft(threadID) {
        if (angular.isDefined(data[threadID].draft)) return data[threadID].draft;
        else return "";
    }
    
    function updateLastChecked(threadID, timeStamp) {
        dataManager.save('threads/' + threadID + '/lastChecked', timeStamp);
        data[threadID].lastChecked = timeStamp;
    }
    
    function participantAdded(threadID, participantUID, timeStamp) {
        var isNew = true;
        for (i in data[threadID].participants) {
            if (participantUID == data[threadID].participants[i]) {
                isNew = false;
                break;
            }
        }
        if (isNew) {
            dataManager.save('threads/' + threadID + '/participants', participantUID, function() {
                updateLastChecked(threadID, timeStamp);
            }, true);
            data[threadID].participants.push(participantUID);
        }
    }
    
    function getParticipants(threadID) {
        // Returns array of the UIDs of the users participating in a thread.
        if (angular.isDefined(data[threadID])) return data[threadID].participants;
        else return [];
    }
    
    // Returns an array of participants who aren't you in a given thread
    function otherParticipants(threadID) {
        var participants = getParticipants(threadID);
        for (i in participants)
            if (participants[i] == users.myUID) {
                participants.splice(i, 1);
                break;
            }
        return participants;
    }
    
    function getColor(threadID) {
        var others = otherParticipants(threadID);
        if (others.length == 1) return users.getColor(others[0]);
        else return "black";
    }
    
    function getFullImage(threadID) {
        var others = otherParticipants(threadID);
        if (others.length == 1) return users.getFullPicture(others[0]);
        else return ""; // TODO: When group support is added, needs to return image that represents a group, or modify the profileThumbnail component to support a collage of participants' profile pictures 
    }
    
    function getThumbnail(threadID) {
        var others = otherParticipants(threadID);
        if (others.length == 1) return users.getThumbnail(others[0]);
        else return ""; // TODO: When group support is added, needs to return image that represents a group, or modify the profileThumbnail component to support a collage of participants' profile pictures 
    }
    
    function getTitle(threadID) {
        var others = otherParticipants(threadID);
        if (others.length == 1) return users.getName(others[0]);
        else return ""; // TODO: When group support is added, needs to return name that represents a group
    }
    
    function isGroup(threadID) {
        return (getParticipants(threadID).length > 2);
    }
    
    function listenForNewMessages(threadID, callback, participant, useStartAt = true) {
        var path = 'threads/' + threadID + '/messages';
        var timeFilter = {
            orderByChild: 'dateTime'
        }
        if (useStartAt) timeFilter.startAt = getMessages(threadID, 1)[0].dateTime + 1;
        if (angular.isDefined(participant)) var participants = [participant];
        else var participants = otherParticipants(threadID);
        for (i in participants) {
            dataManager.listen(path, 'child_added', callback, [{
                orderByChild: 'uid',
                equalTo: participants[i]
            }, timeFilter]);
        }
    }
    
    function listenForNewParticipants(threadID, callback) {
        var sortAndFilter = {
            orderByKey: true
        };
        if (angular.isDefined(data[threadID].lastChecked)) sortAndFilter.startAt = data[threadID].lastChecked + 1;
        dataManager.listen('threads/' + threadID + '/participants', 'child_added', callback, [sortAndFilter]);
    }
    
    //
    function notifyListeners(threadID, newMessage) {
        if (angular.isDefined(listeners["threadListView"])) listeners["threadListView"].newMessage(threadID, newMessage);
        if (angular.isDefined(listeners[threadID])) listeners[threadID].newMessage(newMessage);
        if (angular.isDefined(listeners["threadView"]) && (listeners["threadView"].threadID == threadID)) listeners["threadView"].newMessage(newMessage);
    }
}