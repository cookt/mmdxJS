/**
         DETECTION:
         Uses tracking.js to find markers (color details are specified above)
         Finds a rectangle around a detected object
         (tracker returns "rect" object {x: value, y:value, height:value, width:value, color:value})
         If not rotated, will draw the abovementioned rectange and use its corners
         If rotated, find the intersection of the actual rectange with the abovemention rectangle
         and assigns corners correctly
         */
function detect(){  
            console.log("Start Detecting");
            var tracker = new tracking.ColorTracker(['marker']);
            tracker.on('track', function(event) {
                event.data.forEach(function(rect) {
                    console.log("tracking found rect: ");
                    console.log(rect);
                    tracked_rect = rect;
                    var x = rect.x;
                    var y = rect.y;
                    var w = rect.width;
                    var h = rect.height;
                    //corners might change
                    var corners = [new Point(x,y),new Point(x+w, y+h), new Point(x+w,y), new Point(x, y+h)];
                    var rotated = checkIfRotated();
                    markerRectangle = new Rectangle(corners, rotated);
                    drawRectangle(markerRectangle.getCorners(), "blue");
                    if (markerRectangle.isRotated()){
                        findCorners();
                    }
                    drawRectangle(markerRectangle.getCorners(), "yellow");
                });
            });
            tracking.track('#canvas', tracker); //start tracking
        }
