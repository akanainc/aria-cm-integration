steal("iconsole/SOA/console").then(function(){
	
    //Set api security and URL.  Note: need to do this better
	var client_no;
	var auth_key;
	var host;
	
 
 	// This is the aria account details data
	var accountData;

	//Aria account id retrieved from the Things API
	var ariaAccountId;

	can.getObject("Aria.ariaForm", window, true);
	Aria.ariaForm = SOA.Console.BaseControl(
		/* @Static */
			{
			"defaults" : function() {}
			},
			/* @Prototype */
			{
			   "display" : function() {
				    var thisControl = this;
   						
			     	SOA.Framework.Common.WidgetFactory.draw("ariaCustomForm", {
							}, thisControl.element);
				  	
			     	/*
			     	Init Aria constants
			     	*/

			     	getAriaCredentials();
				  		
				  	/*
				  	Get the Aria account information from the ThingsAPI by passing the app version id
				  	*/
				  	getAccountIdFromThings(thisControl.options.routeDetails.objectVersionId);
				  	

				  	//console.log("ariaAccountId = "  + ariaAccountId);

					//retrieve aria detailed account data and set accountData
			    	getAccount(ariaAccountId);
					
					var div = $( thisControl.element).find("#aria-accounts .copy");
					var statusRow = $( thisControl.element).find("#aria-accounts");	
					var currentDiv = div.clone();
						
						displayOwner(currentDiv, ariaAccountId);
						getInvoiceHistory(currentDiv, ariaAccountId);
						getPaymentHistory(currentDiv, ariaAccountId);
				  		getAcctTransHistory(currentDiv, ariaAccountId);
						currentDiv.removeClass('copy').show();
						statusRow.append(currentDiv);
			
					div.hide(); 
					
				},
			 }
			);
         
      
        function getAriaCredentials(){
			      //console.log("calling Things");
			      $.ajax({
			        url: '/simplethings/Aria/aria.json',
			        type : "GET",
			        async : false,
			        success : function (data){
			          //console.log("This is tenant config" + JSON.stringify(data));
			           client_no = data.ariaId;
			           auth_key = data.ariaKey;
			           host = data.ariaHost;
                    
			        },
			        error: function (err){
			        	console.log("err" + JSON.stringify(err));
			        }
			      });
			    };



         function getAccountIdFromThings(appVersionId){
			      //console.log("calling Things");
			      $.ajax({
			        url: '/simplethings/Aria/appversion/'+ appVersionId +'.json',
			        type : "GET",
			        username: "admin",
			        password: "password",
			        async : false,
			        success : function (data){
			           //console.log("This is Aria Account" + JSON.stringify(data));
			           ariaAccountId = data.Aria.acctNo;
                    
			        },
			        error: function (err){
			        	console.log("err" + JSON.stringify(err));
			        }
			      });
			    };

		function getAccount(accountId){
			     // console.log("calling api getAccount");
			      $.ajax({
			        url: host +'/aria/v2?client_no='+client_no+'&auth_key='+auth_key+'&rest_call=get_acct_details_all&cat=core-api&acct_no='+ accountId+'&output_format=json',
			        type : "POST",
			        async : false,
			        success : function (data){
			           //console.log("This is Aria Account" + JSON.stringify(data));
			           accountData = data;
                    
			        },
			        error: function (err){
			        	console.log("err" + JSON.stringify(err));
			        }
			      });
			    };

		function getInvoiceHistory(element, acct_no){
			     // console.log("calling api getInvoiceHistory");
			      $.ajax({
			        url: host + '/aria/v2?client_no='+client_no+'&auth_key='+ auth_key+'&rest_call=get_acct_invoice_history&cat=core-api&acct_no='+acct_no+'&output_format=json',
			        type : "POST",
			        async : false,
			        success : function (data){
			            displayInvoiceDetails(element, data);
                    
			        },
			        error: function (err){
			        	console.log("err" + JSON.stringify(err));
			        }
			      });
			    };


    	
		function displayInvoiceDetails(element, invoiceHistoryData){
			//console.log("displayInvoiceDetails: This is invoice details " + JSON.stringify(invoiceHistoryData));
			row = $( element ).find("#invoice_history_details .copy");
			var invoices = invoiceHistoryData.invoice_history;
			 
			//console.log("Total invoices = " + invoices.length);
			for(var i=0; i < invoices.length; i++){
		    	var currentItem = row.clone();
			    currentItem.children('.invoiceNumber').text(invoices[i].invoice_no);
			    currentItem.children('.invDate').text(invoices[i].bill_date);
			    currentItem.children('.recurringPeriod').text(invoices[i].recurring_bill_from + " thru " + invoices[i].recurring_bill_thru);
			    currentItem.children('.usagePeriod').text(invoices[i].usage_bill_from + "  thru  " + invoices[i].usage_bill_thru);
			    currentItem.children('.amount').text(invoices[i].debit);
			    currentItem.children('.totalPaid').text(invoices[i].credit);
			    currentItem.children('.balanceDue').text(parseFloat(invoices[i].debit) - parseFloat(invoices[i].credit));
			    currentItem.removeClass('copy').show();
				$(element).find('#invoice_history_details').append(currentItem);
			}
			 
		   	
		};
			function displayPaymentHistory(element, paymentHistoryData){
			//console.log("displayPaymentHistory: This is payement history " + JSON.stringify(paymentHistoryData));
			row = $( element ).find("#payment_history .copy");
			var payments = paymentHistoryData.payment_history;
			if(payments != null){
			//console.log("Total payments = " + payments.length);
			for(var i=0; i < payments.length; i++){
		    	var currentItem = row.clone();
			    currentItem.children('.paymentNo').text(payments[i].transaction_id);
			    currentItem.children('.paymentDate').text(payments[i].payment_date);
			    currentItem.children('.source').text(payments[i].payment_source);
			    currentItem.children('.status').text(payments[i].payment_status);
			    currentItem.children('.amount').text(payments[i].payment_amount);
			    currentItem.children('.appliedAmt').text(payments[i].payment_amount - payments[i].payment_amount_left_to_apply);
			    currentItem.children('.unappliedAmt').text(payments[i].payment_amount_left_to_apply);
			    currentItem.removeClass('copy').show();
				$(element).find('#payment_history').append(currentItem);
			}
		   }
			 
		   	
		};


			     function getPaymentHistory(element, acct_no){
			     // console.log("calling api getPaymentHistory");
			      $.ajax({
			        url: host+ '/aria/v2?client_no='+client_no+'&auth_key='+ auth_key+'&rest_call=get_acct_payment_history&cat=core-api&acct_no='+acct_no+'&output_format=json',
			        type : "POST",
			        async : false,
			        success : function (data){
			           displayPaymentHistory(element,data);
			        },
			        error: function (err){
			           	console.log("err" + JSON.stringify(err));
			        }
			      });
			    };

			     function getAcctTransHistory(element, acct_no){
			      //console.log("calling api getAcctTransHistory");
			      $.ajax({
			        url: host+ '/aria/v2?client_no='+client_no+'&auth_key='+ auth_key+'&rest_call=get_acct_trans_history&cat=core-api&account_no='+acct_no+'&output_format=json',
			        type : "POST",
			        async : false,
			        success : function (data){
			           displayAcctTransHistory(element,data);
			        },
			        error: function (err){
			           	console.log("err" + JSON.stringify(err));
			        }
			      });
			    };

		

     	 	function displayOwner(element, accountId){
     	 		var header = $( element ).find("#account_owner");
     	 		header.text(accountData.first_name + " " + accountData.last_name);
     	 		var acct = $( element ).find("#account_id");
     	 		acct.text(accountId);
     	 		var balanceElement = $( element ).find("#account_balance");
     	 		balance = accountData.balance;
     	 		balanceElement.text("$" + accountData.balance);

     	 	}

		 	function displayAcctTransHistory(element, transHistoryData){
			//console.log("displayAcctTransHistory: This is transaction history " + JSON.stringify(transHistoryData));
			row = $( element ).find("#transaction_history .copy");
			var transactions = transHistoryData.history;
			if(transactions != null){
			console.log("Total transactions = " + transactions.length);
		    var endBalance = parseFloat(accountData.balance);
			for(var i=0; i < transactions.length; i++){
				console.log("Transaction no " + transactions[i].transaction_id)
		    	var currentItem = row.clone();
			    currentItem.children('.transNo').text(transactions[i].transaction_id);
			    currentItem.children('.postingDate').text(transactions[i].transaction_create_date);
			    currentItem.children('.description').text(transactions[i].transaction_desc);
			   
			    console.log(" applied " + transactions[i].transaction_applied_amount  );
				var transAmt = parseFloat(transactions[i].transaction_amount);
			    
			    if(transactions[i].transaction_applied_amount != null){
			    var transAmtApplied = parseFloat(transactions[i].transaction_applied_amount);
			    
				var startingBalance = transAmtApplied + endBalance;
			    
			    currentItem.children('.startBal').text(startingBalance);
			    currentItem.children('.creditAmt').text("(" + transAmt + ")");
			    currentItem.children('.endBal').text(endBalance);
			    endBalance = startingBalance;
				}else{
						
			    if(transAmt > 0){
			     var startingBalance = endBalance - transAmt; 
			     console.log("Starting Balance " + startingBalance);
			     currentItem.children('.startBal').text(startingBalance);
			     currentItem.children('.chargeAmt').text(transAmt);
			     currentItem.children('.endBal').text(endBalance);
			      endBalance = startingBalance;
			    }

			    if (transAmt == 0){
			     var startingBalance = endBalance - transAmt; 
			     console.log("Starting Balance " + startingBalance);
			     currentItem.children('.startBal').text(startingBalance);
			     currentItem.children('.chargeAmt').text(transAmt);
			     currentItem.children('.endBal').text(endBalance);
			      endBalance = startingBalance;
			    }

			   }

			   
			    currentItem.removeClass('copy').show();
				$(element).find('#transaction_history').append(currentItem);
			}
			 }
		   	
		};	    

	return Aria.ariaForm;
});



  				