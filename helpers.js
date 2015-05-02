
// HELPERS
var getPixelRGB = function(pixels, x,y, imageWidth, imageHeight){
    var red = pixels[y*imageWidth*4+x*4];
    var green = pixels[y*imageWidth*4+x*4+1];
    var blue = pixels[y*imageWidth*4+x*4+2];
    return {"r":red, "g":green, "b":blue}
}

var getCoordsFromPixelOffset = function(offset, imageWidth, imageHeight){
    //var offsetInPixels = Math.floor(offset/4);
    var y = Math.floor(offset/imageWidth);
    var x = offset -y*imageWidth;
    return [x,y];

}
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
}

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
}

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
}
var isRed = function(px){
    var  hsl = rgbToHsl(px.r, px.g,px.b);
    var hue = hsl.h * 360;
    if (((hue<=360 && hue >=357) || (hue <=20)) && hsl.s > .7 && hsl.l>.1 && hsl.l<.85){
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
    if (hsl.l <.1){
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
function foundFirstBoxEdge(data){
    for (var x = 0; x < data.length; x+=4) {
        if (isBlackRGB(data[x],data[x+1],data[x+2])) {
            var checkedFurther = true;
            for(var verifyX = x; verifyX < x+40; verifyX+=4) {
                if (!isBlackRGB(data[verifyX],data[verifyX+1],data[verifyX+2])) {
                    checkedFurther = false;
                }
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
 * @param box. Array to fill with box width coordinates.
 * @param data. This row data should be for a y coordinate in the middle of a black box (so it should contain all of the black boxes.)
 * @returns {number}
 */
// Operational: we are given a row somewhere in the vertical middle of the black boxes. We go through that row and when we see the first edge
// we assign it as the start width of the box. Then we keep going while we see black and assign the first not black pixel as the end width.
// This is called four times for the four boxes.
function findBlackBoxEdgesFromMiddle(startX,box,data, y) {
    var lastX = 0;
    for (var x = startX; x < data.length; x+=4) {
        if (isBlackRGB(data[x],data[x+1],data[x+2])) {
            //we found the first edge so add it to the box array
            var checkedFurther = true;
            for(var verifyX = x; verifyX < x+40; verifyX+=4) {
                //context.fillStyle = "green";
                //context.fillRect(verifyX/4, y, 3, 3 );
                if (!isBlackRGB(data[verifyX],data[verifyX+1],data[verifyX+2])) {
                    checkedFurther = false;
                }
            }
            if(checkedFurther){
                box.push(x/4);
                while (isBlackRGB(data[x],data[x+1],data[x+2])) {
                    context.fillStyle = "yellow";
                    context.fillRect(x/4, y, 3, 3 );
                    x+=4;
                }
                box.push(x/4);
                lastX = x;
            }
        }
    }
    console.log("LAST: ",lastX/4);
    return lastX/4;
}

/**
 * Draws lane profiles for searching
 * @param box
 */
function drawLanes(box){
    context.fillStyle = "green";
    context.fillRect(box[0], 0, 3, canvas.height);
    context.fillRect(box[1], 0, 3, canvas.height);
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



