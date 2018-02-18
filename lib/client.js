const dns = require('dns');
const { URL } = require('url');
const _ = require('underscore');
const async = require('async');

// import rules to check for each individual DNS server
const rules = require('./rules');

module.exports = exports = function(payload, fn) { 

    // get hostname from payload data
    const data = payload.getData();
    const myURL = new URL(data.url);
    const hostname = myURL.hostname;

    // set servers to use for initial NS resolving
    dns.setServers(['8.8.8.8', '8.8.4.4']);

    dns.resolveNs(hostname, (err, nsNames) => {
        
        if (err) return fn(err);
        console.log(nsNames);
        // iterate through DNS server names and get their IPs
        async.map(nsNames, dns.resolve, (err, nsIPs) => {

            if (err) return fn(err);
            nsIPs=_.flatten(nsIPs);
            // payload.nsNames = nsNames;
            async.each(rules, function(checkFunc, cb) {

                checkFunc(payload, {

                    nsNames:     nsNames,
                    nsIPs:       nsIPs

                }, function(err) {

                    // bubble up any errors we might get
                    cb(err);

                });

            }, (err) => {

                if (err) return fn(err);
                fn();

            });

        });

    });

};