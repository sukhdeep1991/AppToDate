angular
.module('AppToDate.Controllers')
.controller(
		'upgradeCtrl',
function($scope) {
	var config = new PayPalConfiguration({
		merchantName: "AppToDate", 
		merchantPrivacyPolicyURL: "https://mytestshop.com/policy", 
		merchantUserAgreementURL: "https://mytestshop.com/agreement"
	});
	
	var clientIDs = {
	    "PayPalEnvironmentProduction": appConfig.paypalSanboxId,
	    "PayPalEnvironmentSandbox": appConfig.paypalSanboxId
	  };
	
	PayPalMobile.init(clientIDs, onPayPalMobileInit);
	
	var onPayPalMobileInit = function(){
		// must be called
	      // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
	      PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", config, onPrepareRender);
	}
			
	var onPrepareRender = function(){
		
	}
	
	$scope.upgrade = function(){
		// single payment
        PayPalMobile.renderSinglePaymentUI(createPayment(), 
			function(success){
        	 console.log("Payment was successfull: " + JSON.stringify(success));
        }, function(error){
        	console.log("Payment canceled by user: " + JSON.stringify(error));
        });
	}
	var createPayment = function () {
      // for simplicity use predefined amount
      var paymentDetails = new PayPalPaymentDetails("1.50", "0.40", "0.05");
      var payment = new PayPalPayment("1.95", "USD", "AppToDate activation", "Sale", paymentDetails);
      return payment;
    }
});