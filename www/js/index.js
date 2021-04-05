/***********
 * OU TM352 Block 3, TMA03: index.js
 *
 * To function correctly this file must be placed in a Cordova project and the appopriate plugins installed.
 * You need to complete the code which is commented with TODO.
 * This includes the FRs and a few other minor changes related to your HTML design decisions.
 *
 * Released by Chris Thomson / Stephen Rice: Dec 2020
 * Modified and submitted by (your name here)
 ************/

// Execute in strict mode to prevent some common mistakes
"use strict";

// Declare a TaxiShare object for use by the HTML view
var controller;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
    // Create the TaxiShare object for use by the HTML view
    controller = new TaxiShare();
}

// JavaScript "class" containing the model, providing controller "methods" for the HTML view
function TaxiShare() {
    console.log("Creating controller/model");

    // PRIVATE VARIABLES AND FUNCTIONS - available only to code inside the controller/model
    // Note these are declared as function functionName() { ... }

    // If you are using the browser to run your app you will get a CORS error if you try to send
    // non-GET (i.e. POST/DELETE) requests. To avoid this we use a service called cors-anywhere.
    // The following code sets up the base URLs for GET and non-GET requests for this service.
    // However sometimes cors-anywhere is a bit slow, or returns errors.
    // If this happens make a cup of tea and try again as the problems often resolve themseleves.
    // Note this approach for the EMA as you will need to implement similar functionality.
    var BASE_GET_URL = "http://137.108.92.9/openstack/taxi/";
    var BASE_URL = BASE_GET_URL;
    if (cordova.platformId === "browser") {
        // Work around Taxi Sharing API POST/DELETE CORS errors on browser platform
        // BASE_URL = "https://cors-anywhere.herokuapp.com/" + BASE_URL;
    }

    // HERE Maps code, based on:
    // https://developer.here.com/documentation/maps/3.1.19.2/dev_guide/topics/map-controls-ui.html
    // https://developer.here.com/documentation/maps/3.1.19.2/dev_guide/topics/map-events.html

    // Initialize the platform object:
    var platform = new H.service.Platform({
        // TODO: Change to your own API key or map will NOT work!
        apikey: "5-aCFtXk2uudrb9TUh0jyYWlJAxDsFBPfN156lPD-KY",
    });
    // Obtain the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();
    // Instantiate (and display) a map object:
    var map = new H.Map(
        document.getElementById("mapContainer"),
        defaultLayers.vector.normal.map,
        {
            zoom: 15,
            center: { lat: 52.5, lng: 13.4 },
        }
    );

    // Create the default UI:
    var ui = H.ui.UI.createDefault(map, defaultLayers);
    var mapSettings = ui.getControl("mapsettings");
    var zoom = ui.getControl("zoom");
    var scalebar = ui.getControl("scalebar");
    mapSettings.setAlignment("top-left");
    zoom.setAlignment("top-left");
    scalebar.setAlignment("top-left");
    // Enable the event system on the map instance:
    var mapEvents = new H.mapevents.MapEvents(map);
    // Instantiate the default behavior, providing the mapEvents object:
    new H.mapevents.Behavior(mapEvents);

    var markers = []; // array of markers that have been added to the map

    // TODO Lookup an address and add a marker to the map at the position of this address
    function addMarkerToMap(address) {
        if (address) {
            // Hint: If you call the OpenStreetMap REST API too frequently, your access will be blocked.
            //       We have provided a helper function to prevent this however if you open the app
            //       on several browser windows at once you may still run into problems.
            //       Consider hardcoding locations for testing.

            // Hint: To ensure a marker will be cleared by clearMarkersFromMap, use:
            //       markers.push(marker);
            //       to add it to the markers array

            var onSuccess = function (data) {
                // TODO 2(a) FR2.2
                // You need to implement this function
                // See the TMA for an explanation of the functional requirements

                // Hint: If you can't see the markers on the map if using the browser platform,
                //       try refreshing the page.
            };

            // Hint: We have provided the helper function nominatim.get which uses
            //       the OpenStreetMap REST API to turn an address into co-ordinates.
            //       It does this in such a way that requests are cached and sent to
            //       the OpenStreetMap REST API no more than once every 5 seconds.
            nominatim.get(address, onSuccess);
        }
    }

    // Clear any markers added to the map (if added to the markers array)
    function clearMarkersFromMap() {
        // This is implemented for you and no further work is needed on it
        markers.forEach(function (marker) {
            if (marker) {
                map.removeObject(marker);
            }
        });
        markers = [];
    }

    // Obtain the device location and centre the map
    function centreMap() {
        // This is implemented for you and no further work is needed on it

        function onSuccess(position) {
            console.log("Obtained position", position);
            var point = {
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            };
            map.setCenter(point);
        }

        function onError(error) {
            console.error("Error calling getCurrentPosition", error);

            // Inform the user that an error occurred
            alert("Error obtaining location, please try again.");
        }

        // Note: This can take some time to callback or may never callback,
        //       if permissions are not set correctly on the phone/emulator/browser
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
        });
    }

    // TODO Update the map with addresses for orders from the Taxi Sharing API
    function updateMap() {
        // TODO adjust the following to get the required data from your HTML view
        var oucu = getInputValue("oucu", "jmc2228");

        clearMarkersFromMap();

        // TODO 2(a) FR2.1
        // You need to implement this function
        // See the TMA for an explanation of the functional requirements

        // Hint: You will need to call addMarkerToMap and clearMarkersFromMap.
        // Hint: If you cannot complete FR2.1, call addMarkerToMap with a fixed value
        //       to allow yourself to move on to FR2.2.
        //       e.g. addMarkerToMap("Milton Keynes Central");
    }

    // Register OUCU with the taxi sharing service
    function register(oucu) {
        // 2(a) FR3
        // This is implemented for you and no further work is needed on it

        // Note we have pre-registered your OUCU so using this is only required
        // should you want to add an additional (fictional) OUCU for testing.

        function onSuccess(data) {
            var obj = JSON.parse(data); // Taxi API responses must be manually converted to JSON
            console.log("register: received obj", obj);

            // Inform the user what happened
            if (obj.status == "success") {
                alert("User " + oucu + " has been successfully registered.");
            } else if (obj.message) {
                alert(obj.message);
            } else {
                alert("Invalid OUCU: " + oucu);
            }
        }

        // Post the OUCU to register with the Taxi Sharing API
        var url = BASE_URL + "users";
        console.log("register: sending POST to " + url);
        $.ajax(url, { type: "POST", data: { oucu: oucu }, success: onSuccess });
    }

    // TODO Offer a taxi for the given OUCU
    function offer(oucu, address, startTime, endTime) {
        // TODO 2(a) FR1.1
        // You need to implement this function
        // See the TMA for an explanation of the functional requirements

        // Creating form data and append values passed as parameters
        var formData = new FormData();
        formData.append("oucu", oucu);
        formData.append("type", "0");
        formData.append("address", address);
        formData.append("start", startTime);
        formData.append("end", endTime);

        var url = BASE_URL + "orders";
        var xhr = new XMLHttpRequest();

        // alert the response to the user and include the message
        xhr.onload = function () {
            var obj = JSON.parse(xhr.responseText); // Taxi API responses must be manually converted to JSON
            console.log("offer: received obj", obj);

            if (obj.status == "success") {
                alert("User " + oucu + " has made a successful offer")

            } else if (obj.message) {
                alert(obj.message);
            } else {
                alert(obj.status + " " + obj.data[0].reason);
            }
        }

        xhr.open("POST", url, true);
        xhr.send(formData);
        console.log("offer: sending post to " + url);
    }

    // TODO Request an offered taxi for the given OUCU
    function request(oucu, address, startTime) {
        // TODO 2(a) FR1.2
        // You need to implement this function
        // See the TMA for an explanation of the functional requirements
        
        // Creating form data and append values passed as parameters
        var formData = new FormData();
        formData.append("oucu", oucu);
        formData.append("type", "1");
        formData.append("address", address);
        formData.append("start", startTime);
        
        var url = BASE_URL + "orders";
        var xhr = new XMLHttpRequest();

        // alert the response to the user and include the message
        xhr.onload = function () {
            var obj = JSON.parse(xhr.responseText); // Taxi API responses must be manually converted to JSON
            console.log("request: received obj", obj);

            if (obj.status == "success") {
                alert("User " + oucu + " has made a successful request")

            } else if (obj.message) {
                alert(obj.message);
            } else {
                alert(obj.status + " " + obj.data[0].reason);
            }
        }

        xhr.open("POST", url, true);
        xhr.send(formData);
        console.log("request: sending post to " + url);
    }

    // Cancel all orders (offers and requests) for the given OUCU
    function cancel(oucu) {
        // 2(a) FR1.3
        // This is implemented for you and no further work is needed on it

        function onDeleteSuccess(data) {
            var obj = JSON.parse(data); // Taxi API responses must be manually converted to JSON
            console.log("cancel/delete: received obj", obj);
        }

        function onListSuccess(data) {
            var obj = JSON.parse(data); // Taxi API responses must be manually converted to JSON
            console.log("cancel/list: received obj", obj);

            if (obj.status == "success") {
                // Orders are in an array named "data" inside the "data" object
                var orders = obj.data;

                // Inform the user what is happening
                alert("Deleting " + orders.length + " orders");

                // Loop through each one and delete it
                orders.forEach(function (order) {
                    // Delete the order with this ID for the given OUCU
                    var deleteUrl = BASE_URL + "orders/" + order.id + "?oucu=" + oucu;
                    console.log("cancel/delete: Sending DELETE to " + deleteUrl);
                    $.ajax(deleteUrl, {
                        type: "DELETE",
                        data: {},
                        success: onDeleteSuccess,
                    });
                });
            } else if (obj.message) {
                alert(obj.message);
            } else {
                alert(obj.status + " " + obj.data[0].reason);
            }
        }

        // Get all the orders (offers and requests) for the given OUCU
        var listUrl = BASE_GET_URL + "orders?oucu=" + oucu;
        console.log("cancel/list: Sending GET to " + listUrl);
        $.ajax(listUrl, { type: "GET", data: {}, success: onListSuccess });
    }

    // Set initial HERE Map position
    centreMap();

    // PUBLIC FUNCTIONS - available to the view
    // Note these are declared as this.functionName = function () { ... };

    // Controller function to update map with matches to request or offer
    this.updateMap = function () {
        // 2(a) FR3
        // This is implemented for you and no further work is needed on it

        // Update map now
        updateMap();
    };

    // Controller function to register a user with the web service
    this.registerUser = function () {
        // 2(a) FR3
        // TODO adjust the following to get the OUCU from your HTML view
        var oucu = getInputValue("oucu", "jmc2228");

        // Call the model using values from the view
        register(oucu);
    };

    // Controller function for user to offer to share a taxi they have booked
    this.offerTaxi = function () {
        var defaultStartTime = convertToOrderTime(new Date());

        // TODO adjust the following to get the required data from your HTML view
        var oucu = getInputValue("oucu", "jmc2228");
        var address = getInputValue("addr", "Milton Keynes Central Station");
        var startTime = getInputValue("time", defaultStartTime); // eg. 2020:12:18:14:38
        var hours = getInputValue("hours", "1"); // duration in hours

        // The following code is very sensitive to the formatting of the date/time.
        // The code above automatically populates a defaultStartTime of the correct
        // format based on the current date and time. If you have problems we
        // recommend you leave the input blank on the HTML and use the default.

        // The format of the date and time should be exactly like:
        // 2020:12:18:14:38
        // YYYY:MM:DD:HH:MM
        // OR like
        // 2021-04-01 12:00:00
        // YYYY-MM-DD HH:MM:SS

        // You may change the way this code works if you wish.
        // Please take care with the formatting of the dates for the API call!

        // The model requires an end time, but the view provides a duration, so...
        // ...convert the start time back to a Date object...
        var endDate = convertFromOrderTime(startTime);
        // ...add on the hours (ensuring the string is an integer first)...
        endDate.setHours(endDate.getHours() + parseInt(hours));
        // ...convert back to an end time string
        var endTime = convertToOrderTime(endDate);

        startTime = new Date(startTime);
        startTime = formatDate(startTime, "yyyy:MM:dd:HH:mm", false);

        // Call the model using values from the view
        offer(oucu, address, startTime, endTime);
    };

    // Controller function for user to request to share an offered taxi
    this.requestTaxi = function () {
        // TODO adjust the following to get the required data from your HTML view
        var oucu = getInputValue("oucu", "jmc2228");
        var address = getInputValue("addr", "Open University, Milton Keynes");
        var startTime = getInputValue("time", convertToOrderTime(new Date()));

        startTime = new Date(startTime);
        startTime = formatDate(startTime, "yyyy:MM:dd:HH:mm", false);

        // Call the model using values from the view
        request(oucu, address, startTime);
    };

    // Controller function for user to cancel all their offers and requests
    this.cancel = function () {
        // TODO adjust the following to get the required data from your HTML view
        var oucu = getInputValue("oucu", "jmc2228");

        // Call the model using values from the view
        cancel(oucu);
    };
}
