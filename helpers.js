// HELPERS
var getPixelRGB = function(pixels, x,y, imageWidth, imageHeight){
    var red = pixels[y*imageWidth*4+x*4];
    var green = pixels[y*imageWidth*4+x*4+1];
    var blue = pixels[y*imageWidth*4+x*4+2];
    return {"r":red, "g":green, "b":blue}
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
    if (((hue<=360 && hue >=357) || (hue <=20)) && hsl.s > .7){
        return true
    }
    else{
        return false
    }
};

function isRedRGB(r,g,b){
    var  hsl = rgbToHsl(r, g, b);
    var hue = hsl.h * 360;
    if (((hue<=360 && hue >=357) || (hue <=20)) && hsl.s > .7){
        return true
    }
    else{
        return false
    }
}


function findUpperCorner(a,b,c,d){
    var y = [a[1], b[1], c[1], d[1]].minElement();
    if (a[1]==y){
        return a;
    }
    else if (b[1]==y){
        return b;
    }
    else if (c[1]==y){
        return c;
    }
    else if (d[1]==y){
        return d;
    }
    //should never get here
    else{
        alert("Error in findUpperCorner function");
    }
}
function findHighestSideCorner(a,b,c,d){
    var ys = [a[1], b[1], c[1], d[1]];

    ys.sort(function(a, b){return a-b});
    console.log("sort");
    console.log(ys);
    //second highest element
    var y = ys[1];
    if (a[1]==y){
        return a;
    }
    else if (b[1]==y){
        return b;
    }
    else if (c[1]==y){
        return c;
    }
    else if (d[1]==y){
        return d;
    }
    //should never get here
    else{
        alert("Error in findUpperCorner function");
    }
}
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
function rotateCorner(angle, corner, center){
    var pointX = corner[0];
    var pointY = corner[1];
    var originX = center[0];
    var originY = center[1];
    var x = Math.cos(angle) * (pointX) - Math.sin(angle) * (pointY);
    var y = Math.sin(angle) * (pointX) + Math.cos(angle) * (pointY);
    return [x,y]
}