var config = {
apiKey: "AIzaSyDP9z_IucdD0Aneqog4OQt-tt3BQhS0oEs",
authDomain: "thoughtkeeper-80696.firebaseapp.com",
databaseURL: "https://thoughtkeeper-80696.firebaseio.com",
projectId: "thoughtkeeper-80696",
storageBucket: "thoughtkeeper-80696.appspot.com",
messagingSenderId: "271875655252"
};
firebase.initializeApp(config);

var dataRef = firebase.database();
var count = 0;
var date = new Date();

function getCurrentDateTimeMySql() {        
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    var mySqlDT = localISOTime;
    return mySqlDT;
}

var dateId = "";
var dateDisplay = "";

$(document).on('click', '.card-img-top', function(){
    var userFood = $(this).attr('id');
    // var dateStr = date.toLocaleString();
    dateId = getCurrentDateTimeMySql().slice(0, 10);

    // var dateId = date.toISOString().slice(0,10);

    function writeFood() {
        var newRef = dataRef.ref(dateId + '/' + 'myFood').push();
        var newKey = newRef.key;
        var newFood={
                id: newKey,
                dateAdded: firebase.database.ServerValue.TIMESTAMP,
                food: userFood,
                count: 1,
                dateId: dateId
        }
        var updates = {};
        updates[dateId + '/' + 'myFood' + '/' + userFood]= newFood;
         return dataRef.ref().update(updates);
    }

    var refA = dataRef.ref(dateId + '/' + 'myFood');

    refA.orderByChild('food').equalTo(userFood).once("value",function(snapshot) {   
        var userData = snapshot.val();
            if (!userData){
              writeFood();
            } else {
                var foodCountRef = dataRef.ref(dateId + '/' +'myFood'+ '/' + userFood + '/' + 'count');
                foodCountRef.transaction(function(currentCount) {
                    return (currentCount + 1);
                });
            } 
    })
})


dateId = getCurrentDateTimeMySql().slice(0, 10);

var  theRef = dataRef.ref(dateId + '/' + 'myFood').orderByKey();


theRef.on("child_added", function(childSnapshot) {
   
    
// var dayFood = $("<div class='day-wrap>").prepend(childSnapshot.dateId);


 $('#food-display').prepend("<div class='wrap'>" + "<div class='my-date'>" + childSnapshot.val().dateId +"</div>" + "<div class='my-food'> "  + childSnapshot.val().food + "</div>" + "</div>");

}, function (error) {
   console.log("Error: " + error.code);
});













       
        //  dataRef.ref('/myFood').set(newFood);



//   $('#food-display').append("<div class='food-wrap'>" + "<div>" + foodNum + "</div>" +"<div id='" + userFood + "'>"  + userFood +"</div>" + "</div>");
// });
      
    
  



// dataRef.ref('/myFood/avocado').on("child_changed", function(childSnapshot) {

//     console.log(childSnapshot.val().count);

//     $("#full-display").prepend("<div class='wrap'>" + "<div class='my-food'>" + childSnapshot.val().count +"</div>" + "</div>");

//   }, function(errorObject) {
//     console.log("Errors handled: " + errorObject.code);
//   });





// var userFood = $(this).attr('id');
    
//     var x = $(".food-wrap :nth-child(2)").attr('id');
//     // foodNum++;
//     console.log(userFood);
//     console.log(x);
//     $('#food-display').append("<div class='food-wrap'>" + "<div>" + foodNum + "</div>" +"<div id='" + userFood + "'>"  + userFood +"</div>" + "</div>");