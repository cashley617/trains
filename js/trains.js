

let firebaseConfig = {
    apiKey: "AIzaSyC1e8541irxRhL8RsQE7bcGnGwbD2NioLo",
    authDomain: "trains-cc214.firebaseapp.com",
    databaseURL: "https://trains-cc214.firebaseio.com",
    projectId: "trains-cc214",
    storageBucket: "trains-cc214.appspot.com",
    messagingSenderId: "368590457560",
    appId: "1:368590457560:web:a8c89e6b40908d25"
};


firebase.initializeApp(firebaseConfig);

let database = firebase.database(); 




// Add new T line's here 

$("#add-t-line").on("click", function(event) {
    event.preventDefault();

    // Form inputs
    let tName = $("#t-line-input").val().trim();
    let tDest = $("#destination-input").val().trim();
    let tStart = moment($("#start-time").val().trim(), "HH:mm").format("X");
    let tFreq = $("#rate-input").val().trim();


    let newT = {
        line: tName,
        dest: tDest,
        start: tStart,
        freq: tFreq
    };

    // Send new data to the database 
    database.ref().push(newT);

    console.log(newT.line);
    console.log(newT.dest);
    console.log(newT.start);
    console.log(newT.freq);

    alert("Wicked Pissah!");
    
    // Clear the form for the next user 
    $("#t-line-input").val("");
    $("#destination-input").val("");
    $("#start-time").val("");
    $("#rate-input").val("");

});


// Firebase 

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Make variables 
    let tName = childSnapshot.val().line;
    let tDest = childSnapshot.val().dest;
    let tStart = childSnapshot.val().start;
    let tFreq = childSnapshot.val().freq;

    // Console the info 
    console.log(tName);
    console.log(tDest);
    console.log(tStart);
    console.log(tFreq);

    // Prettify
    var tStartClean = moment.unix(tStart).format("HH:mm");
    

    // Math Time 

    if (maxMoment === trainTime) {
        tArrives = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        // and find the modulus between the difference and the frequency
        let timeDifference = moment().diff(trainTime, "minutes");
        let tRemainder = timeDifference % tFrequency;
        tMinutes = tFrequency - tRemainder;

        // To calculate the arrival time, add the tMinutes to the current time 
        tArrives = moment()
            .add(tMinutes, "m")
            .format("hh:mm A");
    };
    console.log("tMinutes:", tMinutes);
    console.log("tArrives:", tArrives);

    // Add each train's data into the table 
    
    let newInfo = $("<tr>").append(
            $("<td>").text(tName),
            $("<td>").text(tDestination),
            $("<td>").text(tFrequency),
            $("<td>").text(tArrives),
            $("<td>").text(tMinutes),
    );

    $("#t-line-table > tbody").append(newInfo);








})

