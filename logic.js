// Initialize Firebase
var config = {
  apiKey: "AIzaSyBuOB0jpR0TmrryjyYXOBDBjtllx67lRs8",
  authDomain: "first-project-a75da.firebaseapp.com",
  databaseURL: "https://first-project-a75da.firebaseio.com",
  projectId: "first-project-a75da",
  storageBucket: "",
  messagingSenderId: "582235391062",
  appId: "1:582235391062:web:9c0fdb0351656970"
};

firebase.initializeApp(config);

var database = firebase.database();
var currentTime = moment();

database.ref().on("child_added", function(childSnap) {
  var name = childSnap.val().name;
  var destination = childSnap.val().destination;
  var firstTrain = childSnap.val().firstTrain;
  var frequency = childSnap.val().frequency;
  var min = childSnap.val().min;
  var next = childSnap.val().next;

  $("#trainTable > tbody").append(
    "<tr><td>" +
      name +
      "</td><td>" +
      destination +
      "</td><td>" +
      frequency +
      "</td><td>" +
      next +
      "</td><td>" +
      min +
      "</td></tr>"
  );
});

database.ref().on("value", function(snapshot) {});

//grabs information from the form
$("#addTrainBtn").on("click", function() {
  var trainName = $("#trainNameInput")
    .val()
    .trim();
  var destination = $("#destinationInput")
    .val()
    .trim();
  var firstTrain = $("#firstInput")
    .val()
    .trim();
  var frequency = $("#frequencyInput")
    .val()
    .trim();

  //ensures that each input has a value
  if (trainName == "") {
    alert("Enter a train name.");
    return false;
  }
  if (destination == "") {
    alert("Enter a destination.");
    return false;
  }
  if (firstTrain == "") {
    alert("Enter a first train time.");
    return false;
  }
  if (frequency == "") {
    alert("Enter a frequency");
    return false;
  }

  // THE MATH!
  //subtracts the first train time back a year to ensure it's before current time.
  var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
  // the time difference between current time and the first train
  var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
  var remainder = difference % frequency;
  var minUntilTrain = frequency - remainder;
  var nextTrain = moment()
    .add(minUntilTrain, "minutes")
    .format("hh:mm a");

  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    min: minUntilTrain,
    next: nextTrain
  };

  console.log(newTrain);
  database.ref().push(newTrain);

  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#firstInput").val("");
  $("#frequencyInput").val("");

  return false;
});
