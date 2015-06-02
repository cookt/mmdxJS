
//CONSTANTS used in isRed:

var HUE_BOTTOM_LOWER_BOUND = 0;
var HUE_BOTTOM_UPPER_BOUND = 10;
var HUE_TOP_LOWER_BOUND = 320;
var HUE_TOP_UPPER_BOUND = 360;

var SATURATION_LOWER_BOUND = 0.3;
var SATURATION_UPPER_BOUND = 1.0;

var LIGHTNESS_LOWER_BOUND = 0.1;
var LIGHTNESS_UPPER_BOUND = 0.80;

//CONSTANTS used in isBlackRGB:
var BLACK_LIGHTNESS_UPPER_BOUND = 0.2;
var BLACK_SATURATION_LOWER_BOUND = 0.07;


// HELPERS
var getPixelRGB = function(pixels, x,y, imageWidth, imageHeight){
    var red = pixels[y*imageWidth*4+x*4];
    var green = pixels[y*imageWidth*4+x*4+1];
    var blue = pixels[y*imageWidth*4+x*4+2];
    return {"r":red, "g":green, "b":blue}
};

var getCoordsFromPixelOffset = function(offset, imageWidth, imageHeight){
    //var offsetInPixels = Math.floor(offset/4);
    var y = Math.floor(offset/imageWidth);
    var x = offset -y*imageWidth;
    return [x,y];

};
var isAreaRed = function(x,y, areaSize, pixels, imageWidth, imageHeight){
    var threshold = 0.75;//lowest fraction of red points 
    var red = 0;
    for(var i = x-areaSize; i < x+areaSize; i++){
        for(var j = y-areaSize; j < y+areaSize; j++){
            var px = getPixelRGB(pixels, i,j, imageWidth, imageHeight);
            if (isRed(px)){
                red ++;
            }
        }
    }

    return red/(areaSize*areaSize) > threshold;
};

var isAreaBlack = function(x,y, areaSize, pixels, imageWidth, imageHeight){
    var threshold = 0.75;//lowest fraction of black points
    var black = 0;
    for(var i = x-areaSize; i < x+areaSize; i++){
        for(var j = y-areaSize; j < y+areaSize; j++){
            var px = getPixelRGB(pixels, i,j, imageWidth, imageHeight);
            if (isBlack(px)){
                black ++;
            }
        }
    }

    return black/(areaSize*areaSize) > threshold;
};

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return ({
        h: h,
        s: s,
        l: l,
    });
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return ({
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    });
}

var  getPixelPosition = function(x, y, imageWidth, imageHeight){
    return y*imageWidth*4+x*4;
};
var isRed = function(px){
    var  hsl = rgbToHsl(px.r, px.g,px.b);
    var hue = hsl.h * 360;
    if (((hue<=HUE_TOP_UPPER_BOUND && hue >=HUE_TOP_LOWER_BOUND) ||
        (hue >=HUE_BOTTOM_LOWER_BOUND && hue <=HUE_BOTTOM_UPPER_BOUND)) &&
        (hsl.s > SATURATION_LOWER_BOUND && hsl.s <= SATURATION_UPPER_BOUND) &&
        (hsl.l>LIGHTNESS_LOWER_BOUND && hsl.l<LIGHTNESS_UPPER_BOUND)){
        return true
    }
    else{
        return false
    }
};

var isBlack = function(px){
    var  hsl = rgbToHsl(px.r, px.g,px.b);
    if (hsl.l <.1){
        return true
    }
    else{
        return false
    }
};

var isBlackRGB = function(r,g,b){
    var  hsl = rgbToHsl(r, g, b);
    if ((hsl.l < BLACK_LIGHTNESS_UPPER_BOUND) || (r < 110 && g < 110 && b < 110 && hsl.s > BLACK_SATURATION_LOWER_BOUND && hsl.l <40)){
        return true
    }
    else{
        return false
    }
};


/*
 * Calculates the angle ABC (in radians)
 *
 * A first point
 * C second point
 * B center point
 */
function findAngle(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}


function distance(A,B){
    return Math.sqrt(Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2));
}
function findClosest(A,listB, error){
    var DEFAULT_DIST = 1000000000
    var minDist = DEFAULT_DIST;
    var minDistPoint;
    for (var ind = 0; ind < listB.length; ind ++){
        var point = listB[ind];
        var dist = distance(A, point);
        if (dist < error){
            if (distance(A, point)< minDist){
                minDist = distance(A, point);
                minDistPoint = point;

            }
        }
    }

    if (minDist == DEFAULT_DIST ){
        return undefined;
    }
    return minDistPoint;

}
function getRuntime(funct){
    var t0 = performance.now();
    funct();
    var t1 = performance.now();
    var message = "Call to function took " + (t1 - t0) + " milliseconds.";
    $("span").text(message);
}


/***************                             BLACK BOX HELPERS                              *****************/
/**
 * Checks if the row has hit a black box.
 * @param data (row of pixel data)
 * @returns {boolean}
 */
function foundFirstBoxEdge(data,y){
    for (var x = 0; x < data.length; x+=4) {
        //context.fillStyle="yellow";
        //context.fillRect(x,y,1,1);
        if (isBlackRGB(data[x],data[x+1],data[x+2])) {
            context.fillStyle="blue";
            context.fillRect(x/4,y,1,1);
            var checkedFurther = true;
            for(var verifyX = x; verifyX < x+20; verifyX+=4) {
                if (!isBlackRGB(data[verifyX],data[verifyX+1],data[verifyX+2])) {
                    checkedFurther = false;
                }
                //context.fillStyle="green";
                //context.fillRect(verifyX/4,y,1,1);
            }
            if(checkedFurther){
                return true;
            }
        }
    }
    return false;
}

/**
 *
 * @param startX. Position along the row of data to start the search
 * @param boxes. Array to fill with box width coordinates.
 * @param data. This row data should be for a y coordinate in the middle of a black box (so it should contain all of the black boxes.)
 * @returns {number}
 */
// Operational: we are given a row somewhere in the vertical middle of the black boxes. We go through that row and when we see the first edge
// we assign it as the start width of the box. Then we keep going while we see black and assign the first not black pixel as the end width.
// This is called four times for the four boxes.
function findBlackBoxEdgesFromMiddle(startX,boxes,data) {
    console.log("findBlackBoxEdgesFromMiddle");
    var lastX = 0;
    for (var x = startX; x < data.length; x+=4) {
        if (isBlackRGB(data[x],data[x+1],data[x+2])) {
            //we found the first edge so add it to the box array
            var checkedFurther = true;
            for(var verifyX = x; verifyX < x+40; verifyX+=4) {
                if (!isBlackRGB(data[verifyX],data[verifyX+1],data[verifyX+2])) {
                    checkedFurther = false;
                }
            }
            console.log("checkedFurther: ", checkedFurther);
            if(checkedFurther){
                boxes.push(x/4);
                while (isBlackRGB(data[x],data[x+1],data[x+2])) {
                    //context.fillStyle="pink";
                    //context.fillRect(x/4,20,2,2);
                    x+=4;
                }
                boxes.push(x/4);
                lastX = x;
            }
        }
    }
    return lastX/4;
}

/**
 *
 * @param start
 * @param data
 * @returns {boolean}
 */
function checkedForward(start,data){
    var checkedFurther = true;
    for(var verify = start; verify < start+40; verify+=4) {
        if (!isBlackRGB(data[verify],data[verify+1],data[verify+2])) {
            checkedFurther = false;
        }
    }
    return checkedFurther;
}

/**
 *
 * @param box
 */
function getHeights(box){
    var x = box[0]+6;
    var pixelColumnMiddle  = context.getImageData(x,0,1,canvas.height);
    var midData = pixelColumnMiddle.data;
    for(var y = 0; y < midData.length; y+=4){
        //context.fillStyle="purple";
        //context.fillRect(x,y/4,1,1);
        if(isBlackRGB(midData[y],midData[y+1],midData[y+2])){
            if(checkedForward(y, midData)){
                //context.fillStyle="blue";
                //context.fillRect(x,y/4,5,5);
                box.push(y/4);
                while(isBlackRGB(midData[y],midData[y+1],midData[y+2])){
                    y += 4;
                }
                //context.fillStyle="red";
                //context.fillRect(x,y/4,4,4);
                box.push(y/4);
            }
        }
    }
}

/**
 * Draws lane profiles for searching
 * @param box
 */
function drawLanes(box){
    console.log(box);
    context.fillStyle = "green";
    context.fillRect(box[0], box[2], 3, box[3]-box[2]);
    context.fillRect(box[0],box[2], box[1]-box[0],3);
    context.fillRect(box[1], box[2], 3, box[3]-box[2]);
    context.fillRect(box[0],box[3], box[1]-box[0],3);
}

function removeExtraYCoords(box){
    box.pop();
    box.splice(2,1);
}


/****************************                    TESTS                        *******************************/
function colorRedBoxHSL() {

    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    var colorshift = .33

    for (var i = 0; i < data.length; i += 4) {
        red = data[i + 0];
        green = data[i + 1];
        blue = data[i + 2];
        alpha = data[i + 3];
        var hsl = rgbToHsl(red, green, blue);
        var hue = hsl.h * 360;

        // change blueish pixels to the new color
        if (((hue<=360 && hue >=357)
            || (hue <=20)) && hsl.s > .8) {
            var newRgb = hslToRgb(hsl.h + colorshift, 2, .7);
            data[i + 0] = newRgb.r;
            data[i + 1] = newRgb.g;
            data[i + 2] = newRgb.b;
            data[i + 3] = 255;
        }
    }
    context.putImageData(imgData, 0, 0);
}

function colorRedBoxRGB() {

    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    var colorshift = .33;
    var red,green,blue,alpha;


    for (var i = 0; i < data.length; i += 4) {
        red = data[i + 0];
        green = data[i + 1];
        blue = data[i + 2];
        alpha = data[i + 3];

        // change blueish pixels to the new color
        if (isRedOld(red,green, blue)) {
            data[i + 0] = 0;
            data[i + 1] = 255;
            data[i + 2] = 0;
            data[i + 3] = 255;
        }
    }
    context.putImageData(imgData, 0, 0);
}


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




