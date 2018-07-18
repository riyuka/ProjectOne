//render a calendar
// var month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
// var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
// var month_name = ["January","Febrary","March","April","May","June","July","Auguest","September","October","November","December"];

// var holder = document.getElementById("days");
// var prev = document.getElementById("prev");
// var next = document.getElementById("next");
// var ctitle = document.getElementById("calendar-title");
// var cyear = document.getElementById("calendar-year");

// var my_date = new Date();
// var my_year = my_date.getFullYear();
// var my_month = my_date.getMonth();
// var my_day = my_date.getDate();

// function dayStart(month, year) {
// 	var tmpDate = new Date(year, month, 1);
// 	return (tmpDate.getDay());
// }

// function daysMonth(month, year) {
	
// 	if (year%4===0&&year%100!==0||year%400===0) {
// 		return (month_olympic[month]);
// 	} else {
// 		return (month_normal[month]);
// 	}
// }

// function refreshDate(){
// 	var str = "";
// 	var totalDay = daysMonth(my_month, my_year); 
// 	var firstDay = dayStart(my_month, my_year); 
// 	var myclass;
// 	for(var i=1; i<firstDay; i++){ 
// 		str += "<li></li>"; 
// 	}
// 	for(var i=1; i<=totalDay; i++){
// 		if((i<my_day && my_year==my_date.getFullYear() && my_month==my_date.getMonth()) || my_year<my_date.getFullYear() || ( my_year==my_date.getFullYear() && my_month<my_date.getMonth())){ 
// 			myclass = " class='lightgrey'"; 
// 		}else if (i==my_day && my_year==my_date.getFullYear() && my_month==my_date.getMonth()){
// 			myclass = " class='green greenbox' id='today'"; 
// 		}else{
// 			myclass = " class='darkgrey'"; 
// 		}
// 		str += "<li"+myclass+">"+i+"</li>"; 
// 	}
// 	holder.innerHTML = str; 
// 	ctitle.innerHTML = month_name[my_month]; 
// 	cyear.innerHTML = my_year; 
// }
// refreshDate(); 

// prev.onclick = function(ev){
// 	ev.preventDefault();
// 	my_month--;
// 	if(my_month<0){
// 		my_year--;
// 		my_month = 11;
// 	}
// 	refreshDate();
// }
// next.onclick = function(ev){
// 	ev.preventDefault();
// 	my_month++;
// 	if(my_month>11){
// 		my_year++;
// 		my_month = 0;
// 	}
// 	refreshDate();
// }



//connect firebase
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
  var userInput = "";
  var date = new Date();
  

  function getCurrentDateTimeMySql() {        
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    var mySqlDT = localISOTime;
    return mySqlDT;
}
//   var userMood;
//   var date = "";

//   var updates = {};

//   var enableButton = function(){
//     $('.chk').removeAttr('disabled');
// }


// $(document).on('click', '#today', function(){
//     alert('hi')
// });


// $('input.chk').on("change", function(event) {
//     event.preventDefault();

//     $(this).attr('disabled', 'disabled');
//     setTimeout(enableButton, 360000);
   
//         $('input.chk').not(this).prop('checked', false)

   
//     userMood = $(this).attr("data-mood");
//     console.log(userMood);


//     // $(this).off('click');
//     // setTimeout(enableClick, 3000);
      
    
//     date = new Date();

//     var dateStr = date.toLocaleString();

    // dataRef.ref("/myMood").on("child_added", function(snapshot) {

   
        // if (snapshot.child("myDate").exists()) {
    
       
        //   userMood = snapshot.val().mood;

        
    
        //   $("#mood-display").text(snapshot.val().mood);
    
        // }
        // function writeMood() {
        //     // var myRef = firebase.database().ref().push();
        //     // var key = myRef.key;
          
        //     var newMood={
        //         // id: key,
        //         dateAdded: firebase.database.ServerValue.TIMESTAMP,
        //         mood: userMood,
        //         myDate: dateStr,
        //      }
          
        //      dataRef.ref('/myMood').push(newMood);
          
        //   }
      
        //   writeMood();

        // else {
            // dataRef.ref('/myMood').push(newData
            //     // {dateAdded: firebase.database.ServerValue.TIMESTAMP,
            //     // mood: userMood,
            //     // myDate: dateStr}
            //   )

    
//   });
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

    // dataRef.ref('/myThought').push({
    //   dateAdded: firebase.database.ServerValue.TIMESTAMP,
    //   thought: userInput,
    //   myDate: dateStr
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



//   dataRef.ref('/myThought').on("child_added", function(childSnapshot) {

//     console.log(childSnapshot.val().thought);

//     $("#thought-display").prepend("<div class='wrap'>" + "<div class='my-date'>" + childSnapshot.val().dateDisplay +"</div>" + "<div class='my-thought'> " + childSnapshot.val().thought + "</div>" + "</div>");

//   }, function(errorObject) {
//     console.log("Errors handled: " + errorObject.code);
//   };

//   dataRef.ref('/myMood').on("child_added", function(childSnapshot) {

//     console.log(childSnapshot.val().mood);

//     $("#mood-display").prepend("<div class='mood-wrap'>" + "<div class='display-mood'>" + childSnapshot.val().mood +"</div>" + "</div>");
    

//   }, function(errorObject) {
//     console.log("Errors handled: " + errorObject.code);
//   });


//   $('#food').on('click', function(){

//   })

//   $('.checkbox').on('click', function(){


//     var userFood = $(this).attr('data-food');
//     $('#today').append(userFood);

// })
      
//   dataRef.ref().orderByChild("dateAdded").on("child_added", function(childSnapshot) {
//     // $(".display").text(snapshot.val().userInput);
//     $("#full-display").prepend("<div class='wrap'>" + "<div class='my-date'>" + childSnapshot.val().myDate +"</div>" + "<div class='my-thought'> " + childSnapshot.val().thought + "</div>" + "</div>");
// }, function(errorObject) {
//     console.log("Errors handled: " + errorObject.code);
//   });







