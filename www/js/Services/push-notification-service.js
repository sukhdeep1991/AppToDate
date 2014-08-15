var showNotificationInTray = function(title, message){
	var options = {
		type: "basic",
		iconUrl: "images/profile-icon.png",
		title: title,
		message: message,
		priority: 1
	};
	chrome.notifications.create("id1", options, function(notificationId){
		console.log("Notification created successfully with id: " + notificationId)
	});
}

function onNotificationGCM(e) {	
	console.log("onNotificationGCM" + JSON.stringify(e.event));
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                console.log("Device Registered Event Received" + JSON.stringify(e.regid));
                $.when(DB.selectDeviceId()).then(
                    function(deviceId) {
                    	if(deviceId){
                    		console.log("DeviceId already present no need to insert again: " + JSON.stringify(deviceId));
                     	} else {
                     		DB.insertDeviceId(e.regid);
                     	}
                    },
                    function(errorMsg) {
                        console.log("Error while fetching deviceId : " + JSON.stringify(errorMsg));
                    });
            }
            break;

        case 'message':
            if (e.foreground) {
            	console.log("Notification message incoming: " + JSON.stringify(e.payload));
            	var eventService = injector.get('eventService');
               // var my_media = new Media("beep.wav");
               // my_media.play();
            	var payload = e.payload;
            	if(payload != null){
            		switch(payload.NotificationType){
	            		case 'EventCreate':
	            			eventService.insertEventFromNotification(payload.InformationId).then(function(title){
		            			showNotificationInTray("Event Created", "A new event '" + title + "' has been created.");	
		            			console.log("A new event '" + title + "' has been created.")
	            			});
	            			break;
	            		case 'EventEdit':
	            			eventService.updateEventFromNotification(payload.InformationId).then(function(title){
		            			showNotificationInTray("Event Updated", "'" + title + "' has been updated.");
		            			console.log("'" + title + "' has been updated.");
	            			});
	            			break;
	            		case 'EventDelete':
	            			eventService.getEvent(payload.InformationId).then(function(event){
		            			eventService.deleteEventFromNotification(payload.InformationId);
		            			showNotificationInTray("Event Deleted", "'" + event.title + "' has been deleted.");	
		            			console.log("'" + event.title + "' has been deleted.");
	            			});
	        				break;
	            		case 'EventAccepeted':
	            			eventService.updateEventFromNotification(payload.InformationId).then(function(title){
		            			showNotificationInTray("Attendee Accepted", "'" + title + "' has been accepted by an attendee.");		
		            			console.log("'" + title + "' has been accepted by an attendee.");            				
	            			});
	        				break;
	            		case 'EventRejected':
	            			eventService.updateEventFromNotification(payload.InformationId).then(function(title){
		            			showNotificationInTray("Attendee Accepted", "'" + title + "' has been rejected by an attendee.");
		            			console.log("'" + title + "' has been rejected by an attendee.");				
	            			});
	        				break;
	            		case 'EventMayBe':
	            			eventService.updateEventFromNotification(payload.InformationId).then(function(title){
		            			showNotificationInTray("Attendee Accepted", "An attendee may or may not join the event '" + title + "'");
		            			console.log();
	            			});
	        				break;
	            		case 'PersonJoined':
	            			showNotificationInTray("Invitation accepted", "A friend has accepted your invitation");
	        				break;
        			
            		}
            	}
            	console.log("Revieved notification event: " + JSON.stringify(e));
               //alert("Notification Received");
               navigator.notification.alert("Message Recieved !!!");
            }
            else {  
              // otherwise we were launched because the user touched a notification in the notification tray.
            }

            break;

       case 'error':
           break;
       default:
          break;
    }
}