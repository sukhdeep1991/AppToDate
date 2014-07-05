angular.module('AppToDate.Directives',[])
.directive('calendar',function(){
  return{
    restrict:'A',
    scope:{
        Calevents:"=ngModel"
    },
    link:function(scope,element,attr){
        element.fullCalendar({
        header: {
          left:'',
          right: 'prev,next',
          center: 'title'
        },
        editable: true,
        events: scope.Calevents
      });
    }
  }
})

.directive('calendarPicker',function(){
  return{
    restrict:'A',
    link:function(scope,element,attr){
        element.datepicker();
    }
  }
})