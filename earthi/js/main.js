
window.onload = function () {
    // Call the map Api    
        var earth = new WE.map('earth_div');
        earth.setView([46.8011, 8.2266], 2);
        WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          minZoom: 1.6,
          maxZoom: 9,
        }).addTo(earth);

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
			try {
			    tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
	});
    //get the rotation event
    document.addEventListener('rotarydetent', function(ev) {
        /* Get the direction value from the event */
        var direction = ev.detail.direction;
        //Turn ClockWise
        if (direction === 'CW') {
            earth.zoomIn();
        }
        //Turn Counter Clock Wise
        else if (direction === 'CCW') {
            earth.zoomOut();
        }
    });
    
};
