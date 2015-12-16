/*
	Class on which all image analysis operations are performed
	Params:
		image: the Image object the test strip photo is loaded into
		canvas
*/
var TestMatrixImage=function(image, canvasElement){
	this.image=image;
	this.canvas=canvasElement;
	this.markerFrameOuterRect;
	this.markerFrameInnerRect;
	this.markerLanes=[];
	this.diagnosisMap;
}
/*
	Params:
		colorTracker: tracking.js ColorTracker, therefore tracking.js must be loaded into the page first
	Sets the markerFrameOuterRect, if found.
*/
TestMatrixImage.prototype.detectBorderFrame=function(colorTracker){
	console.log("Start Detecting outside border");
    var tracker = colorTracker;
    var markerRectangle;
    tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
            console.log("tracking found rect: ");
            console.log(rect);
            var x = rect.x;
            var y = rect.y;
            var w = rect.width;
            var h = rect.height;
            //corners might change
            var corners = [new Point(x,y),new Point(x+w, y+h), new Point(x+w,y), new Point(x, y+h)];
            markerRectangle=new Rectangle(corners);
        });
    });
    tracking.track(this.canvas, tracker); //start tracking           
    this.markerFrameOuterRect=markerRectangle;
}

TestMatrixImage.prototype.detectInnerFrame=function(colorTracker){
	console.log("Start Detecting inner");
    var tracker = colorTracker;
    var markerRectangle;
    tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
            console.log("tracking found rect: ");
            console.log(rect);
            var x = rect.x;
            var y = rect.y;
            var w = rect.width;
            var h = rect.height;
            //corners might change
            var corners = [new Point(x,y),new Point(x+w, y+h), new Point(x+w,y), new Point(x, y+h)];
            markerRectangle=new Rectangle(corners);
        });
    });
    tracking.track(this.canvas, tracker); //start tracking           
    this.markerFrameInnerRect=markerRectangle;
}

TestMatrixImage.prototype.detectMarkerLaneLocations=function(){

}

TestMatrixImage.prototype.processLanes=function(){

}

TestMatrixImage.prototype.diagnose=function(){

}




