// call NYTimes api
$("#selected").on("click", function(){

var options = $("#selectnews option:selected").text();

var url = "https://api.nytimes.com/svc/mostpopular/v2/mostemailed/" + options + "/30.json";
url += '?' + $.param({
  'api-key': "b58a80c8fcd349ad8bf22c27d4ed50c2"
});
$.ajax({
  url: url,
  method: 'GET',
}).done(function(result) {
    var content = result.results
    var pick = content[Math.floor(Math.random() * content.length)];
    
    var title = pick.title;
    var date = pick.published_date;
    var img = pick.media[0]['media-metadata'][2].url;
    var abstract = pick.abstract;
    var url = pick.url;
    
    $("#news-wrap").append("<div>" + title, "<div>" + date, "<img src='" + img + "' >", "<div>" + abstract, "<a href='" + url + "' target='_blank'"   +"'>" + "Go to this article"  + "</a>"
    )

}).fail(function(err) {
  throw err;
});

$("#news-wrap").text("");

})


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
  
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      
    //   var uid = user.uid;
      uid = firebase.auth().currentUser.uid;
         
      console.log(uid);

      $(".app-container").css("display", "block");
      $("#mood-page").hide();
        $("#food-page").hide();

      $("#journal-btn").click(function(){
        $("#mood-page").hide();
        $("#food-page").hide();
        $("#journal-page").show();
        $(this).addClass('selected');
        $("#mood-btn, #food-btn").removeClass("selected");
      });
    
      $("#mood-btn").click(function(){
        $("#food-page").hide();
        $("#journal-page").hide();
        $("#mood-page").show();
        $(this).addClass('selected');
        $("#journal-btn, #food-btn").removeClass("selected");
      });
    
      $("#food-btn").click(function(){
        $("#mood-page").hide();
        $("#journal-page").hide();
        $("#food-page").show();
        $(this).addClass('selected');
        $("#mood-btn, #journal-btn").removeClass("selected");
      });


      var thoughtRef = dataRef.ref('users'+ '/' + uid + '/' + 'thought');
      var foodRef = dataRef.ref('users'+ '/' + uid + '/' + 'food');
    var moodRef = dataRef.ref('users'+ '/' +uid + '/' + 'mood');
    var foodSpendRef = dataRef.ref('users'+ '/' +uid + '/' + 'food-spend');
    var spendTotalRef = dataRef.ref('users'+ '/' +uid + '/' + 'spend-total');
 

   $("#add").on("click", function(event) {
    event.preventDefault();
    userInput = $("#thought-input").val();
    dateId = getCurrentDateTime().slice(0, 10);
    dateDisplay = getCurrentDateTime();
    $("#thought-input").val("");
    
    if (userInput !== "") {
    var thoughtKey = thoughtRef.push().key;
    var updatesT = {};
    updatesT[thoughtKey] = {
        time: dateDisplay,
        thought: userInput,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }
    thoughtRef.update(updatesT)
}
})

dataRef.ref().child('users'+ '/' + uid + '/' + 'thought').on('child_added', function(snapshot){

    $('#thought-display').prepend("<div class='thought-wrap'>" + "<div class='my-date'>" + snapshot.val().time +"</div>" + "<div class='my-thought'> " + snapshot.val().thought + "</div>" + "</div>");
 
})

$("#food-spend").on("click", function(event) {
    event.preventDefault();
    spendInput = $("#spend-input").val();
   
    dateId = getCurrentDateTime().slice(0, 10);
    dateDisplay = getCurrentDateTime();
    $("#spend-input").val("");

    if (isNaN(spendInput)){
     alert('Please enter numbers') }
    else {
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
        return dataRef.ref('users'+ '/' + uid + '/' + 'spendTotal').update(updatesST)
    }

  
    dataRef.ref().child('users'+ '/' + uid + '/' + 'spendTotal').equalTo('total').once("value",function(snapshot){  

        var countRef = dataRef.ref('users'+ '/' + uid + '/' +'spendTotal' +'/' + 'total');
        countRef.transaction(function(currentCount) {
            return Number(currentCount) + Number(spendInput)})
        });

    updateSpend();

    }

    
})

// updateSpend();

function updateSpend(){

    dataRef.ref().child('users'+ '/' + uid + '/' + 'spendTotal').on("child_added",function(snapshot){  

        console.log(snapshot.val())
        $('#spendtt').html(snapshot.val())
    });
}


dataRef.ref().child('users'+ '/' + uid + '/' + 'food-spend').on('child_added', function(snapshot){

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

    dataRef.ref().child('users'+ '/' + uid + '/' + 'food').orderByChild('food').equalTo(userFood).once("value",function(snapshot){  
        var userData = snapshot.val();
            //console.log(userData)
        if (!userData) {
           writeFood();
        } else {
             var foodCountRef = dataRef.ref('users'+ '/' + uid + '/' +'food'+ '/' + userFood + '/' + 'count');
           foodCountRef.transaction(function(currentCount) {
               return (currentCount + 1);})
               
          }
    });

 
});

dateId = getCurrentDateTime().slice(0, 10);
     
dataRef.ref().child('users'+ '/' + uid + '/' + 'food').orderByKey().on("value",function(snapshot){  
    
    $('#apple-d').html("<div>" + snapshot.val().apple.count + "</div>")
    $('#avocado-d').html( "<div>" + snapshot.val().avocado.count + "</div>")
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
    $('#birthday-cake-d').html( "<div>" + snapshot.val()['birthday-cake'].count + "</div>")
    $('#cherry-d').html( "<div>" + snapshot.val().cherry.count + "</div>")
    $('#cheese-d').html( "<div>" + snapshot.val().cheese.count + "</div>")
    $('#chili-pepper-d').html( "<div>" + snapshot.val()['chili-pepper'].count + "</div>")
    $('#coffee-to-go-d').html( "<div>" + snapshot.val()['coffee-to-go'].count + "</div>")
    $('#crab-d').html( "<div>" + snapshot.val().crab.count + "</div>")
    $('#cotton-candy-d').html( "<div>" + snapshot.val()['cotton-candy'].count + "</div>")
    $('#dim-sum-d').html( "<div>" + snapshot.val()['dim-sum'].count + "</div>")
    $('#doughnut-d').html( "<div>" + snapshot.val().doughnut.count + "</div>")
    $('#pineapple-d').html( "<div>" + snapshot.val().pineapple.count + "</div>")
    $('#grapes-d').html( "<div>" + snapshot.val().grapes.count + "</div>")
    $('#honey-d').html( "<div>" + snapshot.val().honey.count + "</div>")
    $('#food-wine-d').html( "<div>" + snapshot.val()['food-wine'].count + "</div>")
    $('#ice-cream-cone-d').html( "<div>" + snapshot.val()['ice-cream-cone'].count + "</div>")
    $('#hot-chocolate-d').html( "<div>" + snapshot.val()['hot-chocolate'].count + "</div>")
    $('#watermelon-d').html( "<div>" + snapshot.val().watermelon.count + "</div>")
    $('#taco-d').html( "<div>" + snapshot.val().taco.count + "</div>")
    $('#sushi-d').html( "<div>" + snapshot.val().sushi.count + "</div>")
    $('#hazelnut-d').html( "<div>" + snapshot.val().hazelnut.count + "</div>")
    $('#pomegranate-d').html( "<div>" + snapshot.val().pomegranate.count + "</div>")

})


$(document).on("click", 'i', function() {

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

      writeMood();
     
      dataRef.ref().child('users'+ '/' + uid + '/' + 'mood').orderByChild('mood').equalTo(userMood).once("value",function(snapshot){  
        var userData = snapshot.val();
            //console.log(userData)
        if (!userData) {
        writeMood();
        } else {
             var moodCountRef = dataRef.ref('users'+ '/' + uid + '/' +'mood' + '/' + userMood + '/' + 'count');
           moodCountRef.transaction(function(currentCount) {
               return (currentCount + 1);})
         }
    });

    })

    dateId = getCurrentDateTime().slice(0, 10);
     
dataRef.ref().child('users'+ '/' +uid + '/' + 'mood').orderByKey().on("value",function(snapshot){  
    


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
    $('#grin-tongue-count').html( "<div>" + snapshot.val()['grin-tongue'].count + "</div>");
    $('#frown-count').html( "<div>" + snapshot.val().frown.count + "</div>");

})
    

      $("#user_div").css("display", "block");
      $("#logged_div").css("display", "none");
      $("#sign_div").css("display", "none");

      var user = firebase.auth().currentUser;
      if(user != null) {
      var email_id = user.email;
      $("#user_paragraph").text("Welcome: " + email_id);
      }
      
    } else {
      // No user is signed in.
      $("#user_div").css("display", "none");
      $("#logged_div").css("display", "block");
      $("#sign_div").css("display", "block");
    }
  });

  $("#login_button").on("click", function() {
      var userEmail = $("#email_field").val();
      var userPassword = $("#password_field").val();
      $("#mood-page").hide();
        $("#food-page").hide();
        $("#journal-page").show();

      firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
          
          var errorCode = error.code;
          var errorMessage = error.message;
          
          alert("wrong email or password");
          });
          
  });
  var uid;
  var user = firebase.auth().currentUser;
  

  $("#signin_button").on("click", function() {
      var userEmail = $("#signin_email_field").val();
      var userPassword = $("#signin_password_field").val();
      $("#mood-page").hide();
        $("#food-page").hide();
        $("#journal-page").show();
      firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function(user) {
        var user = firebase.auth().currentUser;
        uid = firebase.auth().currentUser.uid;

        function logUser(user) {
            var userKey = dataRef.ref('users').push().uid;
            var updatesUser= {};
            updatesUser[uid] = {
                uid: uid,
            }
            return dataRef.ref('users').update(updatesUser)
        }

        logUser(user); 

    }, function(error) {
          alert('You already have an account');
        });
        $("#signin_email_field").val("");
        $("#signin_password_field").val("");
  });

  $("#logout_button").on("click", function(){
    
    $(".app-container").css("display", "none");

   
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    $("#email_field").val("");
    $("#password_field").val("");
  }).catch(function(error) {
    alert('error');
  });
  });



