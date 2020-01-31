function viewManager() {
    
    var service = this;
    
    this.setView = setView;
    
    // Binds the public functions of this service to the public functions of the View directive's controller, so that the main view can be manipulated from any other component.
    function setView(view) {
        service.elementReady = view.elementReady;
        service.animationReady = view.animationReady;
        service.openThread = view.openThread;
        service.closeThread = view.closeThread;
    }
    
}