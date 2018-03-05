const dns         = require('native-dns');
const S           = require('string');

exports.resolve = function(params, fn) {

  // the results 
  var error     = null;
  var items     = [];

  // formulate our question
  var question = dns.Question({
    
    name:   params.address,
    type:   'NS',

  });
    
  // build the request
  var req = dns.Request({

    question: question,
    server: { 

      address: params.server || '8.8.8.8', 
      port: 53, 
      type: 'udp'

    },
    timeout: 1000,

  });
   
  // handle a timeout if any
  req.on('timeout', function () {

    // done


  });
   
  req.on('message', function (err, result) {

    // get the answers
    var answers = (result || {}).answer || [];

    // loop it all
    for(var i = 0; i < answers.length; i++) {

      // sanity check
      if(S(answers[i].data).isEmpty() == true) continue;

      // add the list
      items.push(answers[i].data);

    }

  });
   
  req.on('end', function () {

    // done
    fn(error, items);

  });
   
  // start the request
  req.send();

};