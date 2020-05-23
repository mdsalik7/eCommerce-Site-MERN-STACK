
//from braintree docx - configure the environment and API credentials:

var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "dcb5sbwvy3zs32m8",
  publicKey: "5mj4vz693wjd7f3z",
  privateKey: "7581de62f0939a20afb73a553ac447ec"
});

exports.getToken = (req, res) => {
    //braintree docx - Generate a client token
    gateway.clientToken.generate({}, function (err, response) {
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response)
        }
      });
}

exports.processPayment = (req, res) => {
    //we need a amount and nonceFromTheClient that we received in the previous step as well to create a transaction
    //expecting thats gonna comeup in the req.body, we are going to throw them from the frontend
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount
    //braintree docx - Create a transaction
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if(err){
              res.status(500).send(error)
          }else{
              res.send(result)
          }
      });
}