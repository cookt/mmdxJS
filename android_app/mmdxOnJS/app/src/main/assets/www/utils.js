// utils

Array.prototype.minElement = function(){
    var n = this.length;
    var minElement = this[0];
    for (var i = 0; i< n; i++){
        if (this[i]<= minElement){
            minElement = this[i];
        }
    }
    return minElement;
}

Array.prototype.maxElement = function(){
    var n = this.length;
    var maxElement = this[0];
    for (var i = 0; i< n; i++){
        if (this[i]>= maxElement){
            maxElement = this[i];
        }
    }
    return maxElement;
}

//DETECTION using tracking.js
var oldRetectRectangle = function(){
    imageData = context.getImageData(0,0,imageWidth, imageHeight);
    pixels = imageData.data;
    console.log("Start Detecting");
    var tracker = new tracking.ColorTracker(['marker']);
    tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
            console.log("track");
            console.log(rect);
            tracked_rect = rect;
            oldCheckIfRotated();
            if (rotated){
                oldFindCorners();
            }
            else{
                oldDrawStraightRectange(rect.x, rect.y, rect.width, rect.height);
            }
        });
    });
    tracking.track('#canvas', tracker);
}
var oldCheckIfRotated = function(){
    var threshhold = .1;
    var x = tracked_rect.x;
    var y = tracked_rect.y;
    var w = tracked_rect.width;
    var h = tracked_rect.height;
    var numPoints = 2*(w+h);
    var countRed = 0;
    for (var i = 0; i<w; i++){
        var px = getPixelRGB(pixels, x+i, y, imageWidth, imageWidth);
        if (isRed(px)){
            countRed++
        }
    }
    for (var i = 0; i<w; i++){
        var px = getPixelRGB(pixels, x+i, y+h, imageWidth, imageWidth);
        if (isRed(px)){
            countRed++
        }
    }
    for (var i = 0; i<h; i++){
        var px = getPixelRGB(pixels, x, y+i, imageWidth, imageWidth);
        if (isRed(px)){
            countRed++
        }
    }
    for (var i = 0; i<h; i++){
        var px = getPixelRGB(pixels, x+w, y+i, imageWidth, imageWidth);
        if (isRed(px)){
            countRed++
        }
    }
    console.log("count red");
    console.log(countRed);
    console.log("num points");
    console.log(numPoints);
    if (countRed/numPoints < threshhold){
        console.log("Rotated");
        rotated = true;
        return true;
    }
    else{
        console.log("Not Rotated");
        rotated = false;
        return false;
    }
}
var oldFindCorners = function(){
    var x = tracked_rect.x;
    var y = tracked_rect.y;
    var w = tracked_rect.width;
    var h = tracked_rect.height;
    var c1, c2, c3, c4;
    //check possible combinations:
    var inc = -1;
    while (!c1){
        inc++;
        //upper line
        for (var i = 0; i < w; i++){
            var px = getPixelRGB(pixels, x+i, y+inc, imageWidth, imageWidth);
            if (isRed(px)){
                c1 = [x+i, y];
                console.log("C1");
                console.log(c1);
                break;
            }
        }
    }
    inc = -1;
    while (!c2){
        inc++;
        //lower line
        for (var i = 0; i < w; i++){
            var px = getPixelRGB(pixels, x+i, y+h-inc, imageWidth, imageWidth);
            if (isRed(px)){
                c2 = [x+i, y+h];
                console.log("C2");
                console.log(c2);
                break;
            }
        }
    }
    inc = -1;
    while (!c3){
        inc++;
        //leftline
        for (var i = 0; i < h; i++){
            var px = getPixelRGB(pixels, x+inc, y+i, imageWidth, imageWidth);
            if (isRed(px)){
                c3 = [x, y+i];
                console.log("C3");
                console.log(c3);
                break;
            }
        }
    }
    while (!c4){
        inc++;
        //right line
        for (var i = 0; i < h; i++){
            var px = getPixelRGB(pixels, x+w-inc, y+i, imageWidth, imageWidth);
            if (isRed(px)){
                c4 = [x+w, y+i];
                console.log("C4");
                console.log(c4);
                break;
            }
        }
    }
    oldDrawRotatedRectangle(c1,c2,c3,c4);
    corners = [c1,c2,c3,c4];
}
var oldDrawStraightRectange = function(x, y, w, h) {
    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(x+w, y);
    context.stroke();
    context.moveTo(x+w, y);
    context.lineTo(x+w, y+h);
    context.stroke();
    context.moveTo(x+w, y+h);
    context.lineTo(x, y+h);
    context.stroke();
    context.moveTo(x, y+h);
    context.lineTo(x, y);
    context.stroke();
    corners = [[x,y],[x+w, y+h], [x+w,y], [x, y+h]];
}
var oldDrawRotatedRectangle = function(c1,c2,c3,c4) {
    console.log("drawRotatedRectangle");
    console.log(c1);
    context.beginPath();
    context.moveTo(c1[0],c1[1]);
    context.lineTo(c3[0],c3[1]);
    context.lineTo(c2[0],c2[1]);
    context.lineTo(c4[0],c4[1]);
    context.lineTo(c1[0],c1[1]);
    context.closePath();
    context.stroke();
}
var oldRotate = function (c1,c2,c3,c4){
    if (!rotated){
        alert("no need to rotate");
        return;
    }
    //rotate 10% more
    var padding = .1;
    var croppedImageURL = canvas.toDataURL();
    var croppedImage = new Image();
    croppedImage.src = croppedImageURL;
    console.log("rotating");
    console.log(c1[1]);
    console.log(c3[1]);
    //find upper left corner
    var uc = findUpperCorner(c1,c2,c3,c4);
    console.log("UPPER CORNER");
    console.log(uc);
    var side = findHighestSideCorner(c1,c2,c3,c4);
    console.log("SIDE");
    console.log(side);
    // B = uc, A = uc with the same y but different x, C = side
    var A = {"x": uc[0]+Math.round(tracked_rect.width/2), "y":uc[1]};
    var B = {"x":uc[0], "y": uc[1]};
    var C = {"x": side[0], "y":side[1]};
    var angle = findAngle(A,B,C);
    console.log("angle");
    console.log(angle);
    var center = [Math.round(tracked_rect.x+tracked_rect.width/2), Math.round(tracked_rect.y+tracked_rect.height/2)];
    console.log("center");
    console.log(center);
    //context.clearRect(0,0,canvas.width,canvas.height);
    context.save();
    context.translate(center[0], center[1]);
    // ccw
    if (side[0]>uc[0]){
        console.log("CCW");
        context.rotate(-1*angle*(1+padding));
    }//cw
    else{
        console.log("CW");
        context.rotate((Math.PI-angle)*(1+padding));
    }
    context.translate(-1*center[0], -1*center[1]);
    context.drawImage(croppedImage,0, 0);
    context.restore();
    rotated = false;
}
function range(start, stop, step){
    if (typeof stop=='undefined'){
        // one param defined
        stop = start;
        start = 0;
    };
    if (typeof step=='undefined'){
        step = 1;
    };
    if ((step>0 && start>=stop) || (step<0 && start<=stop)){
        return [];
    };
    var result = [];
    for (var i=start; step>0 ? i<stop : i>stop; i+=step){
        result.push(i);
    };
    return result;
};