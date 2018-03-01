const dns         = require('dns');
const url         = require('url');
const _           = require('underscore');
const async       = require('async');

// import rules to check for each individual DNS server
const rules = require('./rules');

// expose our main function
module.exports = exports = function(payload, fn) { 

  // get hostname from payload data
  var data = payload.getData();

  // sanity check
  if(!data.url);

  // load the url
  var uri = new url.parse(data.url);

  // get the hostname
  var hostname = uri.hostname;

  // set servers to use for initial NS resolving
  dns.setServers([

    '8.8.8.8', 
    '8.8.4.4'

  ]);


  // resolve the domain name
  dns.resolveNs(hostname, (err, nsNames) => {
      
    // handle the error
    if (err) {

      // show the error
      payload.error('client', 'Something went wrong while checking the name server', err);

      // done
      return fn(null);

    }

    // get/set the records 
    var ipRecords = [];

    // build up the options
    var optionItems = [];

    // loop and run each
    async.eachSeries(nsNames || [], function(nsName, cb) {

      // resolve the DNS
      dns.resolve(nsName, function(err, nsIPs) {

        // check for the error
        if(err) {

          // output the error
          payload.error('client', 'Something went wrong while trying to resolve: ' + nsName);

          // done
          return cb(null);

        }

        // flatten list
        nsIPs = _.flatten(nsIPs);

        // add the items
        for(var i = 0; i < (nsIPs || []).length; i++) {

          // add the list
          optionItems.push({

            server:       nsName,
            address:      nsIPs[i]

          });

          // add to the list
          if(ipRecords.indexOf(nsIPs[i]) !== -1) {

            // add
            payload.addRule({

                message:      'Duplicate name servers addresses',
                type:         'error',
                key:          'unique'

            }, {

              display:        'text',
              message:        'Name server ip $ returned more than once',
              identifiers:    [ nsIPs[i] ]
            
            });

          }

          // add to the list
          ipRecords.push(nsIPs[i]);

        }

        // done
        cb(null);

      });

    }, function() {

      // loop through all the options
      async.eachSeries(data.testOptions || optionItems || [], function(options, cb) {

        // run all the rules for this server
        async.eachSeries(rules, function(checkFunc, cbb) {

          // run it
          checkFunc(payload, options, function() {

            // finish
            cbb();

          });

        }, function() {

          // done
          cb(null);

        });

      }, function() {

        // done
        fn(null);

      });

    })

  });

};