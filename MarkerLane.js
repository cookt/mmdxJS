var MarkerLane=function(start_x,end_x,start_y,end_y,samplingRate){
	this.samplingRate=samplingRate;
	this.start_x=start_x;
	this.end_x=end_x;
	this.start_y=start_y;
	this.end_y=end_y;
	this.strip_length=Math.abs(end_y-start_y);
	this.strip_width=Math.abs(end_x-start_x);
	this.signal={};
}
/**
	stringFunction: function that 
*/
MarkerLane.prototype.processLane=function(stripFunction){
	context.fillStyle="green";
    pixels=context.getImageData(0,0,imageWidth,imageHeight).data;
    var signal={};
    signal.samplingRate=samplingRate;
    signal.start_x=start_x;
    signal.start_y=start_y;
    signal.end_x=end_x;
    signal.end_y=end_y;
    signal.strip_length=Math.abs(end_y-start_y);
    signal.strip_width=Math.abs(end_x-start_x);
    signal.numberOfSamples=Math.ceil(signal.strip_length*samplingRate);
    var increment=Math.floor(signal.strip_length/(signal.numberOfSamples-1));
    var rgbVector=[];
    var hslVector=[];
    var index=0;

    for (var i=start_y; i < end_y; i+=increment){
        var test_r=0;
        var test_g=0;
        var test_b=0;
        //averaging rgb values along each band
        for(var j=start_x; j < end_x; j++){
            rgb=getPixelRGB(pixels,j,i,imageWidth,imageHeight);
            test_r+=rgb.r;
            test_g+=rgb.g;
            test_b+=rgb.b;
        }
        test_r/=signal.strip_width;
        test_g/=signal.strip_width;
        test_b/=signal.strip_width;
        rgbVector[index]={"r":test_r,"g":test_g,"b":test_b};
        hslVector[index]=rgbToHsl(test_r,test_g,test_b);
        index++;
        context.fillRect(start_x,i,signal.strip_width,1);
    }
    signal.rgbVector=rgbVector;
    signal.hslVector=hslVector;
    this.signal=signal;
}