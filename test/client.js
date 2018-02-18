const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../lib/client');

describe('DNS Client', function() {
    
    it('Should return an error if it can\'t connect to DNS servers', function(done) {
    
        // handle the payload
        var payload = passmarked.createPayload({
    
          url: 'http://io.co.za'
    
        }, { log: { entries: [] } }, '')
    
        testFunc(payload, function(err) {
    
            //console.log(err);

            if(err) assert.fail(err);

            // done
            done()
    
        });
    
    });

});
