const dns       = require('dns');
const url       = require('url');
const async     = require('async');
const _         = require('underscore');

/**
* A check to see whether there are at least 2 DNS servers configured
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

  // get the records
  var records = [];

  // check both ipv4 and ipv6
  async.parallel([

    function(cb) {

      // get the list
      dns.resolve4(uri.hostname, function(err, recordsFromHost) {

        // add to the list
        records = records.concat(recordsFromHost || []);

        // done
        cb(err);

      });

    },
    function(cb) {

      // GCP does not support IPV6 for now ...
      return cb(null);

      // get the list
      dns.resolve6(uri.hostname, function(err, recordsFromHost) {

        // add to the list
        records = records.concat(recordsFromHost || []);

        // done
        cb(err);

      });

    }

  ], function(err) {

    // skip if we got a error
    if(err) {

      // done
      payload.error('count', 'Problem went wrong while queriying the records', err);

      // done
      return fn();

    }

    // add the counter
    if(records.length < 2) {

      // add the rule
      payload.addRule({

          message:      'Configure at least 2 DNS Nameservers',
          type:         'error',
          key:          'count'

      }, {

        display:        'text',
        header:         'You need at least two DNS servers',
        message:        'Only found $ configured',
        identifiers:    [ options.server ]
      
      });

    }

    // done
    fn(null);

  });

};
