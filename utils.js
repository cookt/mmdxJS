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