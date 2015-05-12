//classes
function Error(msg, origin){
    this.msg = msg;
    this.origin = origin;
}

function Point(x,y){
    this.x = x;
    this.y = y;
}

function Angle(rad,dir){
    this.radians = rad;
    this.direction = dir;
}

// Corners = list of 4 Point objects
// Rotated = boolean, true if the orientation of the rectangle is rotated
function Rectangle(corners, rotated){
    if (corners.length != 4){
        alert("Rectangle Initialization Error");
        return;
    }
    this.corners = corners;
    this.rotated = rotated;
}

//class methods
Rectangle.prototype.getCorners = function(){
    return this.corners;
}
Rectangle.prototype.setCorners = function(corners){
    this.corners = corners;
}

Rectangle.prototype.isRotated = function(){
    return this.rotated;
}
Rectangle.prototype.setRotated = function(rotated){
    this.rotated = rotated;
}

Rectangle.prototype.findTopCorner = function(){
    if (!this.rotated){
        alert("Rectangle is not rotated");
        return;
    }
    var a = this.corners[0];
    var b = this.corners[1];
    var c = this.corners[2];
    var d = this.corners[3];
    var ys = [a.y, b.y, c.y, d.y];
    //highest element
    var y = ys.minElement();
    if (a.y==y){
        return a;
    }
    else if (b.y==y){
        return b;
    }
    else if (c.y==y){
        return c;
    }
    else if (d.y==y){
        return d;
    }
    //should never get here
    else{
        alert("Error in findUpperCorner function");
    }
}

Rectangle.prototype.findBottomCorner = function(){
    if (!this.rotated){
        alert("Rectangle is not rotated");
        return;
    }
    var a = this.corners[0];
    var b = this.corners[1];
    var c = this.corners[2];
    var d = this.corners[3];
    
    //highest element
    var ys = [a.y, b.y, c.y, d.y];
    var y = ys.maxElement();
    if (a.y==y){
        return a;
    }
    else if (b.y==y){
        return b;
    }
    else if (c.y==y){
        return c;
    }
    else if (d.y==y){
        return d;
    }
    //should never get here
    else{
        alert("Error in findBottomCorner function");
    }
}

Rectangle.prototype.findRightCorner = function(){
    if (!this.rotated){
        alert("Rectangle is not rotated");
        return;
    }
    var a = this.corners[0];
    var b = this.corners[1];
    var c = this.corners[2];
    var d = this.corners[3];
    
    //highest element
    var xs = [a.x, b.x, c.x, d.x];
    var x = xs.maxElement();
    if (a.x==x){
        return a;
    }
    else if (b.x==x){
        return b;
    }
    else if (c.x==x){
        return c;
    }
    else if (d.x==x){
        return d;
    }
    //should never get here
    else{
        alert("Error in findUpperCorner function");
    }
}

Rectangle.prototype.findLeftCorner = function(){
    if (!this.rotated){
        alert("Rectangle is not rotated");
        return;
    }
    var a = this.corners[0];
    var b = this.corners[1];
    var c = this.corners[2];
    var d = this.corners[3];
    
    //highest element
    var xs = [a.x, b.x, c.x, d.x];
    var x = xs.minElement();
    if (a.x==x){
        return a;
    }
    else if (b.x==x){
        return b;
    }
    else if (c.x==x){
        return c;
    }
    else if (d.x==x){
        return d;
    }
    //should never get here
    else{
        alert("Error in findUpperCorner function");
    }
}

Rectangle.prototype.findDirectionOfRotation = function(){
    var top_corner = this.findTopCorner();
    var left_corner = this.findLeftCorner();
    var right_corner = this.findRightCorner();
    //CW
    if (distance(top_corner, left_corner)>distance(top_corner, right_corner)){
        return "CW";
    }
    else{
        return "CCW";
    }

}
Rectangle.prototype.findAngleOfRotation = function(){
    //error checking
    if (!this.rotated){
        return new Error("Angle of rotation is not required, the rectangle is not rotated", "Rectangle.prototype.findAngleOfRotation");
    }

    var top = this.findTopCorner();
    var left = this.findLeftCorner();
    var bottom = this.findBottomCorner();
    var right = this.findRightCorner();
    var direction = this.findDirectionOfRotation();
    console.log("Direction");
    console.log(direction);
    if (direction=="CW"){
        var extra_top_point = new Point(top.x-10, top.y); 
        var angle1 = findAngle(extra_top_point,top,left);

        var extra_bottom_point = new Point(top.x+10, top.y); 
        var angle2 = findAngle(extra_bottom_point,bottom, right);

        var extra_left_point = new Point(left.x, left.y+10); 
        var angle3 = findAngle(extra_left_point,left, bottom);

        var extra_right_point = new Point(right.x, left.y-10); 
        var angle4 = findAngle(extra_right_point,right, top);
        var angles = [angle1, angle2, angle3, angle4];
        var minAngle = angles.minElement();
        

        console.log("ANGLE CW");
        console.log(angle1*180/Math.PI);
        console.log(angle2*180/Math.PI);
        console.log(angle3*180/Math.PI);
        console.log(angle4*180/Math.PI); 
        return new Angle(angle1, direction);

    }
    else{
        var extra_top_point = new Point(top.x+10, top.y); 
        var angle1 = findAngle(extra_top_point,top,right);

        var extra_bottom_point = new Point(top.x-10, top.y); 
        var angle2 = findAngle(extra_bottom_point,bottom, left);

        var extra_left_point = new Point(left.x, left.y-10); 
        var angle3 = findAngle(extra_left_point,left, top);

        var extra_right_point = new Point(right.x, left.y+10); 
        var angle4 = findAngle(extra_right_point,right, bottom);

        var angles = [angle1, angle2, angle3, angle4];
        var minAngle = angles.minElement();
        
        console.log("ANGLE CCW");
        console.log(angle1*180/Math.PI);
        console.log(angle2*180/Math.PI); 
        console.log(angle3*180/Math.PI);
        console.log(angle4*180/Math.PI); 
        return new Angle(2*Math.PI-angle1, direction);
    }
    
}

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
