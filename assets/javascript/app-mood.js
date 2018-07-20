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
 
  var userMood;
  var date = new Date();

  function getCurrentDateTimeMySql() {        
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    var mySqlDT = localISOTime;
    return mySqlDT;
}



//   var enableButton = function(){
//     $('.chk').removeAttr('disabled');
// }

// $(document).on('click', '#today', function(){
//     alert('hi')
// });
var dateId = "";
var dateDisplay = "";


$('input.chk').on("click", function(event) {
    event.preventDefault();

    // $(this).attr('disabled', 'disabled');
    // setTimeout(enableButton, 360000);
   
        // $('input.chk').not(this).prop('checked', false)

   
    userMood = $(this).attr("data-mood");
    console.log(userMood);


    // $(this).off('click');
    // setTimeout(enableClick, 3000);

  
    dateId = getCurrentDateTimeMySql().slice(0, 10);

    // dataRef.ref("/myMood").on("child_added", function(snapshot) {

        // if (snapshot.child("myDate").exists()) {
    
        //   userMood = snapshot.val().mood;

        //   $("#mood-display").text(snapshot.val().mood);
    
        // }
        function writeMood() {
            // var myRef = firebase.database().ref().push();
            // var key = myRef.key;
            var newRef = dataRef.ref(dateId + '/' + 'myMood').push();
            var newKey = newRef.key;
            var newMood={
                // id: newKey,
                // dateAdded: firebase.database.ServerValue.TIMESTAMP,
                mood: userMood,
                dateId: dateId
             }
             var updates = {};
             updates[dateId + '/' + 'myMood' + '/' + userMood]= newMood;
              return dataRef.ref().update(updates);
              dataRef.ref('/myMood').update(newMood);
          }
      
          writeMood();

        // else {
            // dataRef.ref('/myMood').push(newData
            //     // {dateAdded: firebase.database.ServerValue.TIMESTAMP,
            //     // mood: userMood,
            //     // myDate: dateStr}
            //   )

    
  });

  dateId = getCurrentDateTimeMySql().slice(0, 10);

var  theRef = dataRef.ref(dateId + '/' + 'myMood').orderByKey();

var thekeys = dataRef.ref().key;



dataRef.ref().once("value", function(childSnapshot) {



    console.log(JSON.stringify(childSnapshot.key));
   
    // var content = childSnapshot.val();

    // var thedata = JSON.stringify(content);

    




//     // console.log(content['2018-07-16'].myFood.apple.food)

// //     var obj = JSON.parse(content)

// //  console.log(obj)

//     // for (var [k, v] of Object.entries(content)) {
//     //     console.log(`Here is key ${k} and here is value ${v}`);
//     //   }







     



// //    for (key in content) {
// //        console.log(key)
// //    }

// //     //    $('#mood-display').prepend("<div " + " id='" + key +"' >" + key + "</div>")
// //    }
   


//  
// //  $('#mood-display').prepend("<div class='mood-wrap'>" + "<div class='my-date'>" + childSnapshot.val().dateId +"</div>" + "<div class='my-mood'> " + childSnapshot.val().mood + "</div>" + "</div>");
 

}, function (error) {
   console.log("Error: " + error.code);
});



// theRef.on("child_added", function(childSnapshot) {
   
// //     var content = childSnapshot.val().thought;
// // console.log(content);

//  $('#').append("<div class='mood-wrap'>" + "<div class='my-date'>" + childSnapshot.val().dateId +"</div>" + "<div class='my-mood'> " + childSnapshot.val().mood + "</div>" + "</div>");
 

// }, function (error) {
//    console.log("Error: " + error.code);
// });
