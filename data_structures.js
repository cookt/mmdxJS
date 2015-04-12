//classes
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
    
    //highest element
    var y = [a.y, b.y, c.y, d.y].minElement();
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
    var y = [a.y, b.y, c.y, d.y].maxElement();
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

Rectangle.prototype.findHighestSideCorner = function(){
	var a = this.corners[0];
	var b = this.corners[1];
	var c = this.corners[2];
	var d = this.corners[3];
    
    var ys = [a.y, b.y, c.y, d.y];
    ys.sort(function(a, b){return a-b});
    console.log("sort");
    console.log(ys);
    //second highest element
    var y = ys[1];
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
        alert("Error in findHighestSideCorner function");
    }
}

Rectangle.prototype.findLowestSideCorner = function(){
	var a = this.corners[0];
	var b = this.corners[1];
	var c = this.corners[2];
	var d = this.corners[3];
    
    var ys = [a.y, b.y, c.y, d.y];
    ys.sort(function(a, b){return a-b});
    console.log("sort");
    console.log(ys);
    //second highest element
    var y = ys[2];
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
        alert("Error in findLowestSideCorner function");
    }
}

Rectangle.prototype.findAngleOfRotation = function(){
	var uc = this.findTopCorner();
    var sideHigh = this.findHighestSideCorner();
    var bc = this.findBottomCorner();
    var sideLow = this.findLowestSideCorner();
        
    // B = uc, A = uc with the same y but different x, C = side
    var A = new Point(uc.x+10, uc.y);
    var B = uc;
    var C = sideHigh;
    var angle1 = findAngle(A,B,C);

    var A = sideLow;
    var B = bc;
    var C = new Point(bc.x+10, bc.y);

    var angle2 = findAngle(A,B,C);
    var avgAngle = (angle1 +Math.PI-angle2)/2;

    if (sideHigh.x>uc.x){

		return new Angle(-1*avgAngle,"CCW");
	}
	
	else{
		return new Angle(Math.PI - avgAngle,"CW");
	}
    
}