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
    apiKey: "AIzaSyCd25itEtU1gBEoGZPWa4Q4z7xjAc7Vx2c",
    authDomain: "keeper-96b35.firebaseapp.com",
    databaseURL: "https://keeper-96b35.firebaseio.com",
    projectId: "keeper-96b35",
    storageBucket: "keeper-96b35.appspot.com",
    messagingSenderId: "300480516087"
  };
  firebase.initializeApp(config);
  
  function getCurrentDateTime() {        
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    var myDT = localISOTime;
    return myDT;
}

  var dataRef = firebase.database();
  var userInput = "";
  var date = new Date();
  var dateId;
  var dateDisplay;
  


  var thoughtRef = dataRef.ref('thought');
  var foodRef = dataRef.ref('food');
  var moodRef = dataRef.ref('mood');
  var foodSpendRef = dataRef.ref('food-spend');
//   var spendTotalRef = dataRef.ref('spend-total');
 

   $("#add").on("click", function(event) {
    event.preventDefault();
    userInput = $("#thought-input").val();
    dateId = getCurrentDateTime().slice(0, 10);
    dateDisplay = getCurrentDateTime();
    $("#thought-input").val("");

    var thoughtKey = thoughtRef.push().key;
    var updatesT = {};
    updatesT[thoughtKey] = {
        time: dateDisplay,
        thought: userInput,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }
    thoughtRef.update(updatesT)
    
})

dataRef.ref().child('thought').on('child_added', function(snapshot){

    $('#thought-display').prepend("<div class='thought-wrap'>" + "<div class='my-date'>" + snapshot.val().time +"</div>" + "<div class='my-thought'> " + snapshot.val().thought + "</div>" + "</div>");
 
})

$("#food-spend").on("click", function(event) {
    event.preventDefault();
    spendInput = $("#spend-input").val();
   
    dateId = getCurrentDateTime().slice(0, 10);
    dateDisplay = getCurrentDateTime();
    $("#spend-input").val("");

    var foodSpendKey = foodSpendRef.push().key;
    var updatesS = {};
    updatesS[foodSpendKey] = {
        time: dateDisplay,
        foodSpend: spendInput,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }
    foodSpendRef.update(updatesS);

    function writeSpendTotal() {
        
        var updatesST = {};
        updatesST= {
            total: spendInput
        }
        return dataRef.ref('spendTotal').update(updatesST)
    }

  
    dataRef.ref().child('spendTotal').equalTo('total').once("value",function(snapshot){  

             var countRef = dataRef.ref('spendTotal' +'/' + 'total');

           countRef.transaction(function(currentCount) {
               return Number(currentCount) + Number(spendInput) })

          
    });

    updateSpend();

    //     dataRef.ref().on("child_added",function(snapshot){  

    //     console.log(snapshot.val())
    
    //     //    $('#spendtt').html(snapshot.val())
    
         
    // });


    
})

updateSpend();

function updateSpend(){

    dataRef.ref().child('spendTotal').on("child_added",function(snapshot){  

        console.log(snapshot.val())
    
           $('#spendtt').html(snapshot.val())
    
         
    });
}


dataRef.ref().child('food-spend').on('child_added', function(snapshot){

    $('#food-display').prepend("<div class='spend-wrap'>" + "<div class='my-date'>" + snapshot.val().time +"</div>" + "<div class='my-spend'> " + snapshot.val().foodSpend + "</div>" + "</div>");
 
})


$(document).on('click', '.card-img-top', function(){
    var userFood = $(this).attr('id');
    dateId = getCurrentDateTime().slice(0, 10);
    
    function writeFood() {
        var foodKey = foodRef.push().key;
        var updatesF = {};
        updatesF[userFood] = {
            time: dateId,
            food: userFood,
            count : 1,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
        return foodRef.update(updatesF)
    }

    dataRef.ref().child('food').orderByChild('food').equalTo(userFood).once("value",function(snapshot){  
        var userData = snapshot.val();
            //console.log(userData)
        if (!userData) {
           writeFood();
        } else {
             var foodCountRef = dataRef.ref('food'+ '/' + '/' + userFood + '/' + 'count');
           foodCountRef.transaction(function(currentCount) {
               return (currentCount + 1);})
               
          }
    });

 
});

dateId = getCurrentDateTime().slice(0, 10);
     
dataRef.ref().child('food').orderByKey().on("value",function(snapshot){  
    

    //child(dateId).orderByChild('food')
    // $("#food-display").prepend("<div id='" + dateId + "'>" + dateId + "</div>");

    // console.log(snapshot.val().apple.count)

    $('#avocado-d').html("<div>" + snapshot.val().avocado.count + "</div>")
    $('#apple-d').html("<div>" + snapshot.val().apple.count + "</div>")
    $('#banana-d').html( "<div>" + snapshot.val().banana.count + "</div>")
    $('#broccoli-d').html( "<div>" + snapshot.val().broccoli.count + "</div>")
    $('#carrot-d').html( "<div>" + snapshot.val().carrot.count + "</div>")
    $('#corn-d').html( "<div>" + snapshot.val().corn.count + "</div>")
    $('#eggs-d').html( "<div>" + snapshot.val().eggs.count + "</div>")
    $('#cucumber-d').html( "<div>" + snapshot.val().cucumber.count + "</div>")
    $('#hotdog-d').html( "<div>" + snapshot.val().hotdog.count + "</div>")
    $('#burger-d').html( "<div>" + snapshot.val().burger.count + "</div>")
    $('#durian-d').html( "<div>" + snapshot.val().durian.count + "</div>")
    $('#fries-d').html( "<div>" + snapshot.val().fries.count + "</div>")
    $('#asparagus-d').html( "<div>" + snapshot.val().asparagus.count + "</div>")
    $('#pretzel-d').html( "<div>" + snapshot.val().pretzel.count + "</div>")
    $('#cookies-d').html( "<div>" + snapshot.val().cookies.count + "</div>")
    $('#bacon-d').html( "<div>" + snapshot.val().bacon.count + "</div>")
    $('#birthday_cake-d').html( "<div>" + snapshot.val().birthday_cake.count + "</div>")
    $('#cherry-d').html( "<div>" + snapshot.val().cherry.count + "</div>")
    $('#cheese-d').html( "<div>" + snapshot.val().cheese.count + "</div>")
    $('#chili_pepper-d').html( "<div>" + snapshot.val().chili_pepper.count + "</div>")
    $('#coffee-d').html( "<div>" + snapshot.val().coffee.count + "</div>")
    $('#crab-d').html( "<div>" + snapshot.val().crab.count + "</div>")
    $('#cotton_candy-d').html( "<div>" + snapshot.val().cotton_candy.count + "</div>")
    $('#dim_sum-d').html( "<div>" + snapshot.val().dim_sum.count + "</div>")
    $('#doughnut-d').html( "<div>" + snapshot.val().doughnut.count + "</div>")
    $('#pineapple-d').html( "<div>" + snapshot.val().pineapple.count + "</div>")
    $('#grapes-d').html( "<div>" + snapshot.val().grapes.count + "</div>")
    $('#honey-d').html( "<div>" + snapshot.val().honey.count + "</div>")
    $('#wine-d').html( "<div>" + snapshot.val().wine.count + "</div>")
    $('#ice_cream-d').html( "<div>" + snapshot.val().ice_cream.count + "</div>")
    $('#hot_chocolate-d').html( "<div>" + snapshot.val().hot_chocolate.count + "</div>")
    $('#hazelnut-d').html( "<div>" + snapshot.val().hazelnut.count + "</div>")


})
// foodRef.orderByChild(userFood).equalTo(dateId).on("value",function(snapshot) {   
//     var userData = snapshot.val();
//     console.log(JSON.stringify(userData))
//         if (!userData){
//           writeFood();
//         } else {
//             var foodCountRef = dataRef.ref('food'+ '/' + userFood + '/' + dateId + '/' + 'count');
//             foodCountRef.transaction(function(currentCount) {
//                 return (currentCount + 1);
//             });
//         } 

//     })
// })

$(document).on("click", 'i', function() {
    // $(this).attr('disabled', 'disabled');
    // setTimeout(enableButton, 360000);
   
        // $('input.chk').not(this).prop('checked', false)
    userMood = $(this).attr("data-mood");
    console.log(userMood)
    dateId = getCurrentDateTime().slice(0, 10);
    
    function writeMood() {

        var moodKey = moodRef.push().key;
      
         var updatesM = {};
         updatesM[userMood]= {
             count: 1,
             mood: userMood,
             date: dateId,
             timestamp: firebase.database.ServerValue.TIMESTAMP
         }
          return moodRef.update(updatesM);
      }
     
      dataRef.ref().child('mood').orderByChild('mood').equalTo(userMood).once("value",function(snapshot){  
        var userData = snapshot.val();
            //console.log(userData)
        if (!userData) {
           writeMood();
        } else {
             var moodCountRef = dataRef.ref('mood'+ '/' + '/' + userMood + '/' + 'count');
           moodCountRef.transaction(function(currentCount) {
               return (currentCount + 1);})
               
          }
    });

    })

    dateId = getCurrentDateTime().slice(0, 10);
     
dataRef.ref().child('mood').orderByKey().on("value",function(snapshot){  
    

    //child(dateId).orderByChild('food')
    // $("#food-display").prepend("<div id='" + dateId + "'>" + dateId + "</div>");

    // console.log(snapshot.val().apple.count)

    $('#smile-count').html("<div>" + snapshot.val().smile.count + "</div>");
    $('#meh-count').html( "<div>" + snapshot.val().meh.count + "</div>");
    $('#tired-count').html( "<div>" + snapshot.val().tired.count + "</div>");
    $('#rolling-eyes-count').html( "<div>" + snapshot.val()['rolling-eyes'].count + "</div>");
    $('#dizzy-count').html( "<div>" + snapshot.val().dizzy.count + "</div>");
    $('#grin-tears-count').html( "<div>" + snapshot.val()['grin-tears'].count + "</div>");
    $('#laugh-count').html( "<div>" + snapshot.val().laugh.count + "</div>");
    $('#heart-count').html( "<div>" + snapshot.val().heart.count + "</div>");
    $('#surprise-count').html( "<div>" + snapshot.val().surprise.count + "</div>");
    $('#angry-count').html( "<div>" + snapshot.val().angry.count + "</div>");

})
    

    // else {
        // dataRef.ref('/myMood').push(newData
        //     // {dateAdded: firebase.database.ServerValue.TIMESTAMP,
        //     // mood: userMood,
        //     // myDate: dateStr}
        //   )





    // function writeFood() {
    //     var newRef = dataRef.ref('myFood').push();
    //     var newKey = newRef.key;
    //     var newFood={
    //             // id: newKey,
    //             // dateAdded: firebase.database.ServerValue.TIMESTAMP,
    //             food: userFood,
    //             count: 1,
    //             dateId: dateId
    //     }
    //     var updates = {};
    //     updates[dateId + '/' + 'myFood' + '/' + userFood]= newFood;
    //      return dataRef.ref().update(updates);
    // }

    // var refA = dataRef.ref('myFood');

    // refA.orderByChild('food').equalTo(userFood).once("value",function(snapshot) {   
    //     var userData = snapshot.val();
    //         if (!userData){
    //           writeFood();
    //         } else {
    //             var foodCountRef = dataRef.ref(dateId + '/' +'myFood'+ '/' + userFood + '/' + 'count');
    //             foodCountRef.transaction(function(currentCount) {
    //                 return (currentCount + 1);
    //             });
    //         } 
        
    // })



// dataRef.ref().child('thought').once('value', function(snapshot){
//         console.log(JSON.stringify(snapshot.key));
//         console.log(JSON.stringify(snapshot.val()));
//         snapshot.forEach(function(item){
//            var content = JSON.stringify(item.val())
//            $('#thought-display').prepend("<div class='thought-wrap'>" + "<div class='my-date'>" + item.val().time +"</div>" + "<div class='my-thought'> " + item.val().thought + "</div>" + "</div>");
//         })
// })






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
// var dateId = "";
// var dateDisplay = "";

//   $("#add").on("click", function(event) {
//     event.preventDefault();
//     userInput = $("#thought-input").val();
//     dateId = getCurrentDateTimeMySql().slice(0, 10);
//     dateDisplay = getCurrentDateTimeMySql();
//     $("#thought-input").val("");

//     function writeThought() {
//         var newRef = dataRef.ref(dateId + '/' + 'myThought').push();
//         var newKey = newRef.key;
//         var newThought={
//             // id: newKey,
//             // dateAdded: firebase.database.ServerValue.TIMESTAMP,
//             thought: userInput,         
//             dateId: dateId,
//             dateDisplay: dateDisplay
//         }
//         var updates = {};
//              updates[dateId + '/' + 'myThought' + '/' + dateDisplay]= newThought;
//               return dataRef.ref().update(updates);
//               dataRef.ref('/myThought').update(newThought);
//     }
  
//      if (userInput!== "" ) {
//          writeThought()} 
//          else {
//              alert('nothing is added')
//          };

//     // dataRef.ref('/myThought').push({
//     //   dateAdded: firebase.database.ServerValue.TIMESTAMP,
//     //   thought: userInput,
//     //   myDate: dateStr
//     });
     
// dateId = getCurrentDateTimeMySql().slice(0, 10);

// var  theRef = dataRef.ref(dateId + '/' + 'myThought').orderByKey();


// theRef.on("child_added", function(childSnapshot) {
   
// //     var content = childSnapshot.val().thought;
// // console.log(content);

//  $('#thought-display').prepend("<div class='thought-wrap'>" + "<div class='my-date'>" + childSnapshot.val().dateDisplay +"</div>" + "<div class='my-thought'> " + childSnapshot.val().thought + "</div>" + "</div>");
 

// }, function (error) {
//    console.log("Error: " + error.code);
// });



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







