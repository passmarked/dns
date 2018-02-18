const dns = require('dns');
const async = require('async');
const _ = require('underscore');

/**
* A check to see whether the configured DNS servers respond to requests
**/
module.exports = exports = function(payload, options, fn) {

  // iterate through the IPs and get their configs
  async.eachOfSeries(options.nsIPs, (nsIP, key, cb) => {

    // set each NS ip as the server to use for resolving
    dns.setServers(nsIP);
    console.log(options.nsNames[key]);
    dns.resolveSoa(options.nsNames[key], (err, soaRecord) => {

      console.log(err);

      if (err) fn(err);
      cb();

    });
      
  }, (err) => {
      
      console.log(err);
      if (err) fn(err);
      fn();

  });

  if (2 < 2){

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

};

