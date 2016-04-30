//
// jquery Rest API used by leap.
//
// Specify the api version so the urls can be based on it.
// This will return an object with all the api functions.
//

srp.jqueryRest = function(api_version) {

  function api_url(path) {
    return "/" + api_version + "/" + path;
  }

  function register(session) {
    return $.post(api_url("users.json"), {user: session.signup() });
  }

  function update(session, token) {
    return $.ajax({
      url: api_url("users/" + session.id() + ".json"),
      type: 'PUT',
      headers: { Authorization: 'Token token="' + token + '"' },
      data: {user: session.update() }
    });
  }

  function handshake(session) {
    return $.post(api_url("sessions.json"), session.handshake());
  }

  function authenticate(session) {
    return $.ajax({
      url: api_url("sessions/" + session.login() + ".json"),
      type: 'PUT',
      data: {client_auth: session.getM()}
    });
  }

  return {
    register: register,
    update: update,
    handshake: handshake,
    authenticate: authenticate
  };
};

