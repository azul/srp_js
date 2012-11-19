jqueryRest = function() {

  // we do not fetch the salt from the server
  function register(session)
  {
    return sendVerifier(session);
  }

  function sendVerifier(session) {
    var salt = session.getSalt();
    return $.post("users.json", { user:
      { login: session.getI(),
        password_salt: salt,
        password_verifier: session.getV(salt).toString(16)
      }
    });
  }

  function handshake(session) {
    return $.post("sessions.json", { login: session.getI(), A: session.getAstr()});
  }

  function authenticate(session) {
    return $.ajax({
      url: "sessions/" + session.getI() + ".json",
      type: 'PUT',
      data: {client_auth: session.getM()},
    });
  }

  return {
    register: register,
    register_send_verifier: sendVerifier,
    handshake: handshake,
    authenticate: authenticate
  };
};

srp.remote = (function(){

  function signup(){
    jqueryRest().register(srp.session)
    .success(srp.signedUp)
    .error(srp.error)
  };

  function login(){
    jqueryRest().handshake(srp.session)
    .success(receiveSalts)
    .error(srp.error)
  };

  function receiveSalts(response){
    // B = 0 will make the algorithm always succeed
    // -> refuse such a server answer
    if(response.B === 0) {
      srp.error("Server send random number 0 - could not login.");
    }
    else if(! response.salt || response.salt === 0) {
      srp.error("Server failed to send salt - could not login.");
    } 
    else 
    {
      srp.session.calculations(response.salt, response.B);
      jqueryRest().authenticate(srp.session)
      .success(confirmAuthentication)
      .error(srp.error);
    }
  };

  // Receive M2 from the server and verify it
  // If an error occurs, raise it as an alert.
  function confirmAuthentication(response)
  {
    if (srp.session.validate(response.M2))
      srp.loggedIn();
    else
      srp.error("Server key does not match");
  };


  return {
    signup: signup,
    login: login
  }

}());
