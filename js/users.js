function users(dataManager) {
    
    var myUID = dataManager.myUID();
    
    this.myUID = myUID;
    this.init = init;
    this.downloadUser = downloadUser;
    this.getName = getName;
    this.getThumbnail = getThumbnail;
    this.getFullPicture = getFullPicture;
    this.getColor = getColor;
    this.getThreads = getThreads;
    this.listenForNewThreads = listenForNewThreads;
    
    var data;
    
    function init(callback) {
        dataManager.load('users', function(users) {
            data = users;
            if (angular.isDefined(callback)) callback();
        });
    }
    
    function downloadUser(uid, callback) {
        var path = 'users/' + uid;
        dataManager.download(path, function(key, value) {
            data[key] = value;
            dataManager.save(path, value, callback, key);
        });
    }
    
    function getName(uid) {
        if (angular.isDefined(data[uid])) return data[uid].name;
        else return "";
    }
    
    function getThumbnail(uid) {
        /*if (angular.isDefined(pictures.thumbnail[uid])) return pictures.thumbnail[uid];
        else {
            var picture = new Image(); 
            picture.src = data[uid].profilePicture; // TODO: URL shouldn't be complete in the data. More flexibility desired
            pictures.thumbnail[uid] = picture;
            return picture;
        }*/
        return data[uid].profilePicture; // TODO: URL shouldn't be complete in the data. More flexibility desired
    }
    
    function getFullPicture(uid) {
        /*if (angular.isDefined(pictures.full[uid])) return pictures.full[resolution][uid];
        else {
            var picture = new Image(data[uid].profilePicture); // TODO: URL shouldn't be complete in the data. More flexibility desired
            pictures.full[uid] = picture;
            return picture;
        }*/
        return data[uid].profilePicture; // TODO: URL shouldn't be complete in the data. More flexibility desired
    }
    
    function getColor(uid) {
        if (angular.isDefined(data[uid])) return data[uid].color;
        else return "";
    }
    
    function getThreads() {
        return data[myUID].threads;
    }
    
    function addThread(threadID) {
        dataManager.save(path, threadID, true);
        data[myUID].threads.push(threadID);
    }
    
    function listenForNewThreads(startAt, callback) {
        // callback parameter is optional and expects a function with the following parameters: (threadID)
        var path = 'users/' + myUID + '/threads';
        dataManager.listen(path, 'child_added', callback, {
            startAt: startAt,
            orderByKey: true
        });
    }
}