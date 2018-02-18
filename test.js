const dns = require('dns');

dns.resolveNs('hydracorp.ltd', (err, addresses) => {

    
    console.log(addresses);

});
