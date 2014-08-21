angular
.module('AppToDate.Controllers')
.controller(
		'upgradeCtrl',
function($scope) {
	$scope.setNavTitle("Upgrade");
	var config = new PayPalConfiguration({
		merchantName: "AppToDate"
	});
	
	var clientIDs = {
	    "PayPalEnvironmentProduction": appConfig.paypalSanboxId,
	    "PayPalEnvironmentSandbox": appConfig.paypalSanboxId
	  };
	
	var onPrepareRender = function(){
		console.log("Pay pal rendered");		
	}
	var onPayPalMobileInit = function(){
		console.log("Pay pal initialized");
		// must be called
	      // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
	      PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", config, onPrepareRender);
	}
	console.log("Initializing with Ids: " + JSON.stringify(clientIDs));
	PayPalMobile.init(clientIDs, onPayPalMobileInit);
	
	
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