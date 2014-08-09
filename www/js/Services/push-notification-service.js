function onNotificationGCM(e) {
	console.log("onNotificationGCM" + JSON.stringify(e.event));
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                console.log("Device Registered Event Received" + JSON.stringify(e.regid));
                DB.insertDeviceId(e.regid);
            }
            break;

        case 'message':
            if (e.foreground) {
            	var eventService = injector.get('eventService');
               // var my_media = new Media("beep.wav");
               // my_media.play();
            	var payload = e.payload;
            	if(payload != null){
            		switch(payload.NotificationType){
	            		case 'EventCreate':
	            			eventService.insertEventFromNotification(payload.InformationId);
	            			break;
	            		case 'EventEdit':
	            			eventService.updateEventFromNotification(payload.InformationId);
	            			break;
	            		case 'EventDelete':
	            			eventService.deleteEventFromNotification(payload.InformationId);
	        				break;
	            		case 'EventAccepeted':
	        				break;
	            		case 'EventRejected':
	        				break;
	            		case 'EventMayBe':
	        				break;
	            		case 'PersonJoined':
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