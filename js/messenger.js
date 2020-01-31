
// Initializes an instance of the Messenger application, then returns the corresponding Angular module.
// To use, call this function, providing as an argument the ID of the element in which you want the application to appear.

function messenger(elementID, colors = {}, moduleName = elementID) {
	
	// Create an Angular module for the application.
	var module = angular.module(moduleName, []);
	
	// Assign service values (can be accessed from any part of the app).
	module.value('colors', colors);
	
	// Register service functions (can be accessed from any part of the app).
	module.service('dataManager', dataManager); // See dataManager.js
	module.service('users', ['dataManager', users]); // See users.js
	module.service('threads', ['dataManager', 'users', threads]); // See threads.js
	module.service('viewManager', viewManager); // See viewManager.js
	
	// Register directives (isolated functions used to assign custom functionality to HTML elements)
	module.directive('profileThumbnail', profileThumbnail); // See profileThumbnail.js
	module.directive('threadPreview', threadPreview); // See threadPreview.js
	module.directive('message', message); // See message.js
	module.directive('messageCluster', messageCluster); // See messageCluster.js
	module.directive('threadView', threadView); // See threadView.js
	module.directive('threadListView', threadListView); // See threadListView.js
	module.directive('view', ['$compile', 'viewManager', 'colors', 'users', 'threads', view]); // See view.js
	
	// Define Angular element from provided elementID
	var element = angular.element(document.getElementById(elementID));
	
	// Append a view element as a child of the provided element
	element.append('<view></view>'); // See view.js
	
	// Bootstrap the module onto the provided element
	angular.bootstrap(element, [moduleName]);
	
	return module;
}