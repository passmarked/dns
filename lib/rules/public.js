const dns       = require('dns');
const url       = require('url');
const async     = require('async');
const _         = require('underscore');

/**
* A check to see whether the configured DNS servers respond to requests
**/
module.exports = exports = function(payload, options, fn) {

  // the ip must not be private
  if(options.address.indexOf('10.') === 0 || 
      options.address.indexOf('172.168') === 0 || 
        options.address.indexOf('192.168') === 0 || 
          options.address.indexOf('127.0.0.1') === 0) {

    // add the rule
    payload.addRule({

        message:      'DNS server must be public',
        type:         'error',
        key:          'public'

    }, {

      display:        'text',
      message:        'Server $, responded with $ which is a private/local network ip',
      identifiers:    [ options.server, options.address ]
    
    });

  }

  // done
  fn();

};

