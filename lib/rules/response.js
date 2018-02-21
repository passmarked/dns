const dns       = require('dns');
const url       = require('url');
const async     = require('async');
const _         = require('underscore');

/**
* A check to see whether the configured DNS servers respond to requests
**/
module.exports = exports = function(payload, options, fn) {

  // get the url
  var data = payload.getData();

  // check if we got a url
  if(!data.url) return fn(null);

  // get the url
  var uri = url.parse(data.url);

  // set to the name servers given
  dns.setServers([

    options.address

  ]);

  // set each NS ip as the server to use for resolving
  dns.resolveSoa(uri.hostname, (err, record) => {

    // check if we got a error
    if(err || !record) {

      // add the rule
      payload.addRule({

          message:      'SOA could not be queried',
          type:         'error',
          key:          'response'

      }, {

        display:        'text',
        header:         'The SOA record for $ could not be queried from DNS Server $',
        message:        'Currently configured: $ ',
        identifiers:    [ uri.hostname, options.server ]
      
      });

    }

    // done
    fn();

  });

};

