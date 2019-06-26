

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


    alert("Wicked Pissah!");
    
    // Clear the form for the next user 
    $("#t-line-input").val("");
    $("#destination-input").val("");
    $("#start-time").val("");
    $("#rate-input").val("");

});

function timeDiff(now, start, freq) {
    const hourDiff = now.substring(0, 2) - start.substring(0, 2)
    const minDiff = now.substring(3, 5) - start.substring(3, 5)

    if (hourDiff < 0) {
        return (60 - minDiff) + (hourDiff * (-60) - 60)
    }

    return freq - (((hourDiff * 60) + minDiff) % freq)
}

// Firebase 
database.ref().on("child_added", function(childSnapshot) {

    // Make variables 
    let tName = childSnapshot.val().line;
    let tDest = childSnapshot.val().dest;
    let tStart = childSnapshot.val().start;
    let tFreq = childSnapshot.val().freq;


    // Prettify
    let tStartClean = moment.unix(tStart).format("HH:mm");

    // Math Time 
    let rightNow = new Date()
        rightNow = rightNow.getHours() + ":" + rightNow.getMinutes()

    const arrivingIn = timeDiff(rightNow, tStartClean, tFreq);
    let timeDifference = moment().diff(tStartClean, "minutes");
    let tRemainder = timeDifference % tFreq;
    
    tMinutes = tFreq - tRemainder;

    // To calculate the arrival time, add the tMinutes to the current time 
    let rightNowObj = moment(rightNow, "HH:mm a");
    tArrives = moment(rightNowObj).add(arrivingIn, "minutes").format("HH:mm a");

    // Add each train's data into the table 
    let newInfo = $("<tr>").append(
            $("<td>").text(tName),
            $("<td>").text(tDest),
            $("<td>").text(tFreq),
            $("<td>").text(tArrives),
            $("<td>").text(arrivingIn),
    );

    $("#t-line-table > tbody").append(newInfo);

});

