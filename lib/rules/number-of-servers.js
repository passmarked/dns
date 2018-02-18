/**
* A check to see whether there are at least 2 DNS servers configured
**/
module.exports = exports = function(payload, options, fn) {

  amountOfServers = options.nsNames.length;

  if (amountOfServers < 2){

    // add the rule
    payload.addRule({

        message:  'Not enough DNS servers',
        type:     'error',
        key:      'number-of-dns-servers'

    }, {

      display:        'text',
      header:         'You need at least two DNS servers',
      message:        'Currently configured: $ ',
      identifiers:    [ options.nsNames[0] ]
    
    });

  }

  // finish
  return fn(null);


};
