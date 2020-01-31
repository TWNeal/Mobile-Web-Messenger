function dataManager() {

    var isDemo = true;
    
    this.store = store;
    this.save = save;
    this.upload = upload;
    this.load = load;
    this.download = download;
    this.listen = listen;
    this.timeStamp = timeStamp;
    this.myUID = myUID;

    if (isDemo) console.log("This application is in demo mode. It is not storing or retrieving real user data.");
    
    // Sends data to server at the given path, then saves that data to local storage at the given path when complete. 
    function store(path, data, callback, makeChild = false) {
        upload(path, data, function(key) {
            save(path, data, function() {
                if (angular.isDefined(callback)) callback(key);
            }, makeChild);
        }, makeChild);
    }
    
    // Saves data to local storage at the given path.
    function save(path, data, callback, makeChild = false) {
        // The makeChild parameter expects a boolean or key (string or number). If true (boolean), will assume the given path corresponds to an array and push the data as a child. If key, will assign the data as a child at the given key. If false, will set the data equal to the given path (which has the potential to overwrite data, so be careful).
        if (isDemo) {
            if (makeChild === true) {
                console.log("Save function was called, adding a child to the path " + path);
            } else if (makeChild === false) {
                console.log("Save function was called, setting data at the path " + path);
            } else {
                console.log("Save function was called, adding a child to the path " + path);
            }
            if (angular.isDefined(callback)) callback();
        } else {
            // TODO: save data to storage using a Cordova plugin
        }
    }
    
    // Sends data to server at the given path.
    function upload(path, data, callback, makeChild = false) {
        // makeChild parameter expects a boolean or key (string or number). If true (boolean), will assume the given path corresponds to an array and push the data as a child. If key, will assign the data as a child at the given key. If false or not defined, will set the data equal to the given path (which has the potential to overwrite data, so be careful).
        // callback parameter is optional and expects a function with no parameters.
        if (isDemo){
            var key = timeStamp();
            if (makeChild === true) {
                console.log("Upload function was called, adding a child to the path " + path + " with the key " + key);
            } else if (makeChild === false) {
                console.log("Upload function was called, setting data at the path " + path);
            } else {
                console.log("Upload function was called, adding a child to the path " + path + " with the key " + key);
            }
            if (angular.isDefined(callback)) callback(key);
        } else {
            // TODO: once connected to server, ensure that the data uploads to the server
        }
    }
    
    
    // Loads data from local storage at the given path.
    function load(path, callback) {
        path = path.split('/');
        if (isDemo) proceed(demoData);
        else {
            // TODO: load data from storage using Cordova plugin
        }
        function proceed(data) {
            for (i in path) {
                data = data[path[i]];
            }
            callback(data);
        }
    }
    
    // Downloads any data from the server at the given path.
    function download(path, callback) {
        if (isDemo) console.log("Download function was called, retrieving data from the path " + path);
        else {
            // TODO: once connected to server, retrieve specified data from server
        }
    }
    
    function listen(path, event, callback, sortAndFilter) {
        // event parameter expects one of the following strings: 
        // sortAndFilter parameter expects an array of objects with the following potential properties: {startAt, endAt, limitToFirst, limitToLast, equalTo, orderByChild, orderByKey, orderByValue}. The order in which these objects appear in the array is the order in which the corresponding ueries will occur.
        // callback parameter expects a function with the following parameters: (key, value)
        
        // TODO
    }
    
    function timeStamp() { 
        // TODO: replace this with an object that will actually get a time stamp from the server.
        return new Date().getTime();
    }

    function myUID() {
        if (isDemo) return "me";
        else {
            // TODO: get actual UID of user
        }
    }
    
    var demoData = {
        // Data contained in this object is meant for showcasing the app without a server. It is not to be in the final app.
        users: {
            // Data contained in this object is meant for showcasing the app without a server. It is not to be in the final app.
            "me": {
                "name": "Person Name",
                "profilePicture": "img/users/lucysmith.png",
                "color": "#262626",
                "threads": [
                    "one",
                    "two",
                    "three",
                    "four",
                    "five",
                    "six",
                    "seven",
                    "eight",
                    "nine",
                    "ten"
                ]
            },
            "taylorneal": {
                "name": "Taylor Neal",
                "profilePicture": "img/users/taylorneal.png",
                "color": "#158993"
            },
            "shelbygoodman": {
                "name": "Shelby Goodman",
                "profilePicture": "img/users/shelbygoodman.png",
                "color": "#262626"
            },
            "dawncameron": {
                "name": "Dawn Cameron",
                "profilePicture": "img/users/dawncameron.png",
                "color": "#181593"
            },
            "michaeljohnson": {
                "name": "Michael Johnson",
                "profilePicture": "img/users/michaeljohnson.png",
                "color": "#931e15"
            },
            "dad": {
                "name": "Dad",
                "profilePicture": "img/users/dad.png",
                "color": "#cb8100"
            },
            "jessieroberts": {
                "name": "Jessie Roberts",
                "profilePicture": "img/users/jessieroberts.png",
                "color": "#db3f3f"
            },
            "richardsellers": {
                "name": "Richard Sellers",
                "profilePicture": "img/users/richardsellers.png",
                "color": "#533700"
            },
            "summerknight": {
                "name": "Summer Knight",
                "profilePicture": "img/users/summerknight.png",
                "color": "#159327"
            },
            "samanthaspencer": {
                "name": "Sam Spencer",
                "profilePicture": "img/users/samanthaspencer.png",
                "color": "#93158c"
            },
            "lucysmith": {
                "name": "Lucy Smith",
                "profilePicture": "img/users/lucysmith.png",
                "color": "#db3f95"
            }
        },
        threads: { // Contains data about the threads.
            "one": {
                "participants": ["me", "taylorneal"],
                "messages": [
                    {
                        uid: "taylorneal",
                        content: "What do you think?",
                        dateTime: 1
                    }, {
                        uid: "taylorneal",
                        content: "What do you think?",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "Really cool!",
                        dateTime: 2
                    }, {
                        uid: "me",
                        content: "Did you make an Android version too?",
                        dateTime: 3
                    }, {
                        uid: "taylorneal",
                        content: "Yup. And a Windows Phone version.",
                        dateTime: 4
                    }, {
                        uid: "me",
                        content: "Whoa, now that's dedication",
                        dateTime: 5
                    }, {
                        uid: "taylorneal",
                        content: "And a Blackberry version.",
                        dateTime: 6
                    }, {
                        uid: "me",
                        content: "They still make those???",
                        dateTime: 7
                    }, {
                        uid: "taylorneal",
                        content: "I don't even know.",
                        dateTime: 8
                    }, {
                        uid: "taylorneal",
                        content: "Aaaand an Ubuntu version.",
                        dateTime: 9
                    }, {
                        uid: "me",
                        content: "I... What?",
                        dateTime: 10
                    }, {
                        uid: "taylorneal",
                        content: "I used a multiplatform framework called Cordova",
                        dateTime: 11
                    }, {
                        uid: "taylorneal",
                        content: "Basically built the app entirely with web technologies (HTML, CSS, JavaScript). Makes porting to different platforms extremely simple!",
                        dateTime: 12
                    }, {
                        uid: "me",
                        content: "Neeeerd",
                        dateTime: 13
                    }
                ]
            },
            "two": {
                "participants": ["me", "shelbygoodman"],
                "messages": [
                    {
                        uid: "me",
                        content: "I am in need of a lawyer.",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "I am in need of a lawyer.",
                        dateTime: 1
                    }, {
                        uid: "shelbygoodman",
                        content: "Well... I just so happen to be a lawyer.",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "Yes, that is of course why I am messaging you.",
                        dateTime: 2
                    }, {
                        uid: "shelbygoodman",
                        content: "Most prospective clients call me instead of messaging me.",
                        dateTime: 3
                    }, {
                        uid: "me",
                        content: "Right. I need a lawyer because my phone was stolen by my ex.",
                        dateTime: 4
                    }, {
                        uid: "me",
                        content: "Along with my car.",
                        dateTime: 5
                    }, {
                        uid: "me",
                        content: "And my cat.",
                        dateTime: 6
                    }, {
                        uid: "shelbygoodman",
                        content: "contact@shelbygoodman.ga",
                        dateTime: 7
                    }, {
                        uid: "shelbygoodman",
                        content: "Send me an email.",
                        dateTime: 8
                    }
                ]
            },
            "three": {
                "participants": ["me", "dawncameron"],
                "messages": [
                    {
                        uid: "me",
                        content: "zero 1/3",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "Love your photos!",
                        dateTime: 8
                    }, {
                        uid: "dawncameron",
                        content: "Aww thanks!",
                        dateTime: 9
                    }
                ]
            },
            "four": {
                "participants": ["me", "michaeljohnson"],
                "messages": [
                    {
                        uid: "michaeljohnson",
                        content: "How's the write-up coming along?",
                        dateTime: 1
                    }, {
                        uid: "michaeljohnson",
                        content: "How's the write-up coming along?",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "Almost finished!",
                        dateTime: 2
                    }, {
                        uid: "me",
                        content: "Should be able to send it to you in an hour or so. ",
                        dateTime: 3
                    }, {
                        uid: "me",
                        content: "I'm really happy with it",
                        dateTime: 4
                    }, {
                        uid: "michaeljohnson",
                        content: "Good, I can't wait to see it!",
                        dateTime: 5
                    }, {
                        uid: "me",
                        content: "How's your part coming? Are you finished?",
                        dateTime: 6
                    }, {
                        uid: "michaeljohnson",
                        content: "Nah I haven't started yet",
                        dateTime: 7
                    }, {
                        uid: "me",
                        content: "What!?",
                        dateTime: 8
                    }, {
                        uid: "me",
                        content: "Our project is due in 12 hours!",
                        dateTime: 9
                    }, {
                        uid: "michaeljohnson",
                        content: "Relax, I got this.",
                        dateTime: 10
                    }, {
                        uid: "me",
                        content: "Do you...?",
                        dateTime: 11
                    }, {
                        uid: "me",
                        content: "It better be good",
                        dateTime: 12
                    }, {
                        uid: "michaeljohnson",
                        content: "It will be. That's why I'm starting with 12 whole hours left",
                        dateTime: 13
                    }
                ]
            },
            "five": {
                "participants": ["me", "dad"],
                "messages": [
                    {
                        uid: "dad",
                        content: "Where are you? Thought you'd be home by now.",
                        dateTime: 1
                    }, {
                        uid: "dad",
                        content: "Where are you? Thought you'd be home by now.",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "I'm upstairs",
                        dateTime: 2
                    }, {
                        uid: "dad",
                        content: "Hi Upstairs, I'm Dad.",
                        dateTime: 3
                    }, {
                        uid: "me",
                        content: "Should have seen that one coming",
                        dateTime: 4
                    }, {
                        uid: "dad",
                        content: "Glad you're home safe. Did you get any dinner yet?",
                        dateTime: 5
                    }, {
                        uid: "me",
                        content: "No I'm starving",
                        dateTime: 6
                    }, {
                        uid: "dad",
                        content: "Hi Starving, I'm Dad.",
                        dateTime: 11
                    }
                ]
            },
            "six": {
                "participants": ["me", "samanthaspencer"],
                "messages": [
                    {
                        uid: "me",
                        content: "Hey Sam!",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "Hey Sam!",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "What are you up to this weekend??",
                        dateTime: 2
                    }, {
                        uid: "samanthaspencer",
                        content: "Hey! Not sure yet. Mary and I were considering going to see the new Marvel movie tonight",
                        dateTime: 3
                    }, {
                        uid: "samanthaspencer",
                        content: "Would you want to come??",
                        dateTime: 4
                    }, {
                        uid: "me",
                        content: "Yeah definitely. What time are you thinking?",
                        dateTime: 5
                    }, {
                        uid: "samanthaspencer",
                        content: "6:20",
                        dateTime: 6
                    }, {
                        uid: "me",
                        content: "Mind if we go to the later one? Have some things I have to get done",
                        dateTime: 7
                    }, {
                        uid: "samanthaspencer",
                        content: "Fine with us! We'll probably grab dinner beforehand if you want to join us for that too",
                        dateTime: 8
                    }, {
                        uid: "me",
                        content: "Sounds good to me!",
                        dateTime: 9
                    }
                ]
            },
            "seven": {
                "participants": ["me", "richardsellers"],
                "messages": [
                    {
                        uid: "me",
                        content: "I sent it, check your email!",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "I sent it, check your email!",
                        dateTime: 1
                    }, {
                        uid: "richardsellers",
                        content: "Thanks, I appreciate it!",
                        dateTime: 2
                    }
                ]
            },
            "eight": {
                "participants": ["me", "lucysmith"],
                "messages": [
                    {
                        uid: "me",
                        content: "Hey Lucy!! You still have this number?",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "Hey Lucy!! You still have this number?",
                        dateTime: 1
                    }, {
                        uid: "lucysmith",
                        content: "HEY!!! Long time no talk!",
                        dateTime: 2
                    }
                ]
            },
            "nine": {
                "participants": ["me", "jessieroberts"],
                "messages": [
                    {
                        uid: "me",
                        content: "Hey there!",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "Hey there! How are you doing?",
                        dateTime: 1
                    }, {
                        uid: "jessieroberts",
                        content: "SUMMER'S MOVING BACK!!!!",
                        dateTime: 3
                    }, {
                        uid: "jessieroberts",
                        content: "I mean pretty good, you?",
                        dateTime: 5
                    }, {
                        uid: "me",
                        content: "WTF",
                        dateTime: 6
                    }
                ]
            },
            "ten": {
                "participants": ["me", "summerknight"],
                "messages": [
                    {
                        uid: "me",
                        content: "Summer! I hear you're moving back to the area",
                        dateTime: 1
                    }, {
                        uid: "me",
                        content: "Summer! I hear you're moving back to the area",
                        dateTime: 1
                    }, {
                        uid: "summerknight",
                        content: "Oh no! I was going to surprise you once I got there!!",
                        dateTime: 2
                    }, {
                        uid: "me",
                        content: "hahaha Oops",
                        dateTime: 3
                    }, {
                        uid: "summerknight",
                        content: "Who told you?",
                        dateTime: 4
                    }, {
                        uid: "summerknight",
                        content: "It was Jessie wasn't it?",
                        dateTime: 5
                    }, {
                        uid: "me",
                        content: "What?! No, Jessie would never spill a secret.",
                        dateTime: 6
                    }, {
                        uid: "summerknight",
                        content: "Okay yeah it was Jessie.",
                        dateTime: 7
                    }, {
                        uid: "me",
                        content: "It was Jessie",
                        dateTime: 8
                    }, {
                        uid: "me",
                        content: "She was kind of pressured into it though",
                        dateTime: 9
                    }, {
                        uid: "me",
                        content: "I asked her how she was doing and she blurted it out",
                        dateTime: 10
                    }, {
                        uid: "summerknight",
                        content: "I should have surprised her too",
                        dateTime: 11
                    }, {
                        uid: "summerknight",
                        content: "Bad move on my part",
                        dateTime: 12
                    }, {
                        uid: "summerknight",
                        content: "Really bad move",
                        dateTime: 13
                    }, {
                        uid: "me",
                        content: "What were you thinking?",
                        dateTime: 14
                    }, {
                        uid: "me",
                        content: "I can still act surprised if that would help",
                        dateTime: 15
                    }, {
                        uid: "summerknight",
                        content: "I'll just think of a new surprise",
                        dateTime: 16
                    }, {
                        uid: "summerknight",
                        content: "Or maybe I won't. I'll surprise you.",
                        dateTime: 17
                    }, {
                        uid: "me",
                        content: "I love surprises",
                        dateTime: 18
                    }, {
                        uid: "me",
                        content: "When are you moving!?",
                        dateTime: 19
                    }, {
                        uid: "summerknight",
                        content: "End of the month! I'm so excited!",
                        dateTime: 20
                    }, {
                        uid: "me",
                        content: "Me too! ",
                        dateTime: 20.5
                    }, {
                        uid: "summerknight",
                        content: "Still trying to pick out an apartment",
                        dateTime: 21
                    }, {
                        uid: "me",
                        content: "I went through this process recently. Anything I can do to help?",
                        dateTime: 22
                    }, {
                        uid: "summerknight",
                        content: "Definitely, tour some places with me!",
                        dateTime: 23
                    }, {
                        uid: "me",
                        content: "Would love to!",
                        dateTime: 24
                    }, {
                        uid: "me",
                        content: "When can you make it down to tour?",
                        dateTime: 25
                    }, {
                        uid: "summerknight",
                        content: "How about next Saturday?",
                        dateTime: 26
                    }, {
                        uid: "me",
                        content: "That sounds great!",
                        dateTime: 27
                    }, {
                        uid: "me",
                        content: "Let's get breakfast that morning and then go on a tour spree",
                        dateTime: 28
                    }, {
                        uid: "summerknight",
                        content: "Sounds like a plan!",
                        dateTime: 29
                    }, {
                        uid: "summerknight",
                        content: "I'll send you the web pages of some places I'm hoping to go see",
                        dateTime: 30
                    }, {
                        uid: "summerknight",
                        content: "Let me know what you think",
                        dateTime: 31
                    }, {
                        uid: "me",
                        content: "Yeah show me!",
                        dateTime: 32
                    }, {
                        uid: "summerknight",
                        content: "Will send over the list when I get home :)",
                        dateTime: 33
                    }
                ]
            }
        }
    };
    
}