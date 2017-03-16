//Train schedule app

$("document").ready(function() {
    // Initialize Firebase
    // This is the code we copied and pasted from our app page
    var config = {
        apiKey: "AIzaSyD0LfUzXWug62ZAfVKx3MbXalb-SlnuM8w",
        authDomain: "train-schedule-d2a26.firebaseapp.com",
        databaseURL: "https://train-schedule-d2a26.firebaseio.com",
        storageBucket: "train-schedule-d2a26.appspot.com",
        messagingSenderId: "52151475183"
    };
    firebase.initializeApp(config);
    // Variables
    // ================================================================================
    // Get a reference to the database service
    var database = firebase.database();

    // At the initial load, get a snapshot of the current data.
    database.ref().on("child_added", function(snapshot) {

        //when new values are submitted calculate the times    
        var startTime = snapshot.val().firstTrainTime;
        // //startTime to unix format 
        var startTimeInSeconds = moment(startTime, "hh:mm").format("X");
        // create a variable called currentTime and store the time on it on unix timestamp format
        var currentTime = moment(new Date().getTime());

        var currentTimeInSeconds = moment(new Date().getTime()).format("X");
        //retreive the frequency 
        frequencyInSeconds = (snapshot.val().frequency) * 60
        //Calculate Next Arrival and Minutes Away 
        if (startTimeInSeconds < currentTimeInSeconds) {
            var secondsToNextArrival = (currentTimeInSeconds - startTimeInSeconds) % frequencyInSeconds;
            var nextArrival = parseInt(currentTimeInSeconds) + frequencyInSeconds - secondsToNextArrival;
            var minutesAway = parseInt((frequencyInSeconds - secondsToNextArrival) / 60);
            nextArrival = moment.unix(nextArrival).format("hh:mm A");
        } else {
            currentTimeInSeconds = parseInt(currentTimeInSeconds);
            startTimeInSeconds = parseInt(startTimeInSeconds);
            var minutesAway = (frequencyInSeconds + startTimeInSeconds - currentTimeInSeconds ) /60;
            minutesAway = parseInt(minutesAway);
            var nextArrival = moment.unix(startTimeInSeconds).format("hh:mm A");
        }

        tableRow = $("<tr>");
        tableRow.append("<td>" + snapshot.val().trainName + "</td>");
        tableRow.append("<td>" + snapshot.val().destination + "</td>");
        tableRow.append("<td>" + snapshot.val().frequency + "</td>");
        tableRow.append("<td>" + nextArrival + "</td>");
        tableRow.append("<td>" + minutesAway + "</td>");

        $("#tableContent").append(tableRow);



        // If any errors are experienced, log them to console.
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    //Add train to train schedule table 
    $("#add-train").on('click', function(event) {
        event.preventDefault();
        var trainName = $("#train-name").val().trim();
        var destination = $("#destination").val();
        var firstTrainTime = $("#first-train-time").val();
        var frequency = $("#frequency").val();


        // Save the new train to firebase 
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

    });



});
