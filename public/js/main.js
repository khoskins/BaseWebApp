
function myFunction() {
  // use jQuery ($ is shorthand) to find the div on the page and then change the html
  // jQuery can do a lot of crazy stuff so make sure to google around to find out more

  $("#demo").html("Hello hello hello wazzup");

  // 'img-circle' is a bootstrap thing! Check out more here: http://getbootstrap.com/css/
  $("#doge-image").append(`<img class="img-circle" src="/images/grumpy-cat.jpg" />`);
}


function createHTML(message) {
  var author = message
  "
    <div>${message.title}</div>
    <div>${message.author}</div>
    <div>${message.body}</div>
  "
}


function initializeStreamListener() {
  const databaseStreamReference = firebase.database().ref('/stream/');

  databaseStreamReference.on('value', function(snapshot) {
    var messages = snapshot.val();
    $('#stream').empty();

    if (messages) {
      Object.keys(messages).forEach(function (key) {
        const message = messages[key];
        $('#stream').append(createHTML(message));
      });
    }
  });
}


function addMessage(body, title) {
  var user = firebase.auth().currentUser;
  var authorPic = user.photoURL;
  var author = user.displayName;

  var postData = {
    author: author,
    authorPic: authorPic,
    title: title,
    body: body
  };

  var newPostKey = firebase.database().ref().child('stream').push().key;
  firebase.database().ref('/stream/' + newPostKey).set(postData);
}


function handleMessageFormSubmit() {
  var body = $('#new-post-body').val();
  var title = $('#new-post-title').val();

  addMessage(body, title);
}

function toggleSignIn() {
  if (!firebase.auth().currentUser) { // if no user, handle login
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("success");
    }).catch(function(error) {
      console.error("error", error);
    });
  } else { // handle logout
    firebase.auth().signOut();
  }

  //This disables the button until login or logout is successful
  $('#login-button').attr("disabled", true);
}

// The main purpose of this function is to set up a listener (using firebase) for when the auth state changes.
// If a user isn't authenticated, we should not show the stream and prompt them to log in.
// If a use IS authenticated, we should load/show the stream and give them the option to log out.
window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $('#stream').show();
      $('#login-button').html("Log out");
      initializeStreamListener();
    } else {
      $('#stream').hide();
      $('#login-button').html("Log in with google");
    }
    $('#login-button').attr("disabled", false);
  });
};