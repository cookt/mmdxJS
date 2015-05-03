Troubleshooting:

1. Degrees of rotation that do not work: 350, 290

Hardcoded constants:

1. isRed in helpers: 

	(hue<=360 && hue >=357) || (hue <=20)) && hsl.s > .7 && hsl.l>.1 && hsl.l<.85

2. checkIfRotated in main:
	the image is said to be rotated, if the points of the detected rectangle (obtained from tracking.js and adjusted after application of Harris operator) have a ratio of red/nonRed < .1

3. removeMarkers in main:
	padding = 10px;
	removes markers 10px more towards the innner part of the marker

External libraries used:

1. Tracking.js
http://trackingjs.com/


2. Cornerdetect.js (Harris operator, MIT License)
https://github.com/wellflat/javascript-labs/tree/master/cv/corner_detection

