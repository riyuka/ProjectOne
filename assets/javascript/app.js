//connect firebase
var config = {
  apiKey: "AIzaSyCd25itEtU1gBEoGZPWa4Q4z7xjAc7Vx2c",
   authDomain: "keeper-96b35.firebaseapp.com",
   databaseURL: "https://keeper-96b35.firebaseio.com",
   projectId: "keeper-96b35",
   storageBucket: "keeper-96b35.appspot.com",
   messagingSenderId: "300480516087"
};
firebase.initializeApp(config);

var dataRef = firebase.database();
var userInput = "";
var date = new Date();


function getCurrentDateTimeMySql() {        
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
  var mySqlDT = localISOTime;
  return mySqlDT;
}


var dateId = "";
var dateDisplay = "";

$("#add").on("click", function(event) {
  event.preventDefault();
  userInput = $("#thought-input").val();
  dateId = getCurrentDateTimeMySql().slice(0, 10);
  dateDisplay = getCurrentDateTimeMySql();
  $("#thought-input").val("");

  function writeThought() {
      var newRef = dataRef.ref(dateId + '/' + 'myThought').push();
      var newKey = newRef.key;
      var newThought={
          id: newKey,
          dateAdded: firebase.database.ServerValue.TIMESTAMP,
          thought: userInput,         
          dateId: dateId,
          dateDisplay: dateDisplay
      }
      var updates = {};
           updates[dateId + '/' + 'myThought' + '/' + dateDisplay]= newThought;
            return dataRef.ref().update(updates);
            dataRef.ref('/myThought').update(newThought);
  }

   if (userInput!== "" ) {
       writeThought()} 
       else {
           alert('nothing is added')
       };


  });
   
dateId = getCurrentDateTimeMySql().slice(0, 10);

var  theRef = dataRef.ref(dateId + '/' + 'myThought').orderByKey();


theRef.on("child_added", function(childSnapshot) {
 
//     var content = childSnapshot.val().thought;
// console.log(content);

$('#thought-display').prepend("<div class='wrap'>" + "<div class='my-date'>" + childSnapshot.val().dateDisplay +"</div>" + "<div class='my-thought'> " + childSnapshot.val().thought + "</div>" + "</div>");


}, function (error) {
 console.log("Error: " + error.code);
});




