//
// The default remote. Feel free to overwrite this.
// We use the jquery and rest based api in leap and default
// to version 1 for now.
//
// In the future we'll probably fetch the version number from the servers
// provider.json.
// In order to prepare for this srp.remote is a function. The first time
// it is called it will fetch the necessary info from the server then.
//

srp.remote = function() {
  return srp.flow(srp.jqueryRest('1'));
}

