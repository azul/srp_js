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

  function api_request(ajax_opts) {

    function extractVersion(response) {
      if ( typeof response.api_version !== 'string' ) {
        srp.error("could not parse api version");
      }
      else {
        api_version = response.api_version;
        api_request(ajax_opts);
      }
    };

    if (typeof api_version !== 'string') {
      $.get('provider.json').
        fail(srp.error).
        done(extractVersion)
    }
    else {
      ajax_opts.url = api_url(ajax_opts.url);
      return $.ajax(ajax_opts);
    }
  };

  function register(session) {
    return api_request({
      url: "users.json",
      type: 'POST',
      data: {user: session.signup() }
    });
  }

  function update(session, token) {
    return api_request({
      url: "users/" + session.id() + ".json",
      type: 'PUT',
      headers: { Authorization: 'Token token="' + token + '"' },
      data: {user: session.update() }
    });
  }

  function handshake(session) {
    return api_request({
      url: "sessions.json",
      type: 'POST',
      data: session.handshake()
    });
  }

  function authenticate(session) {
    return api_request({
      url: "sessions/" + session.login() + ".json",
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

