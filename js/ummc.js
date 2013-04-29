callRfcCount = 0;
callBodyConnected = 0;
sap_user = localStorage.getItem('sap-user');
body_disconnected = '';

function hide(){
   var docHeight = $(document).height();
   $("body").append("<div id='overlay'></div>");
   $("#overlay")
      .height(docHeight)
      .css({
         'opacity' : 0.4,
         'position': 'absolute',
         'top': 0,
         'left': 0,
         'background-color': 'black',
         'width': '100%',
         'z-index': 5000
      });   
};

function show(){
   $("body").remove("#overlay#");
};

function disconnect(){
    callRfcCount = 0;
    sap_user = '';
    localStorage.setItem('sap-user', '');
    localStorage.setItem('sap-password','');
    $('body').html(body_disconnected);
};

function CallHideRfc(CallType, PlaceName, Param) {
    Param['sap-user'] = localStorage.getItem('sap-user');
    Param['sap-password'] = localStorage.getItem('sap-password');
    $.post(CallType, Param, function (data) {
        if (data != 'login error') $(PlaceName).html(data);
        if ($(PlaceName).html().replace(/[^\w]/g, "") == '0') {
            $(PlaceName).closest("a").replaceWith(function () {
                return $("<span>" + $(PlaceName).closest("a").html() + "</span>");
            });
        } else {    
            $(PlaceName).removeClass("ummc_badge_gray");
        }    
    });
}

function CallRfc(CallType, PlaceName, Param) {
    Param['sap-user'] = localStorage.getItem('sap-user');
    Param['sap-password'] = localStorage.getItem('sap-password');
    callRfcCount = callRfcCount + 1;
    $.post(CallType, Param, function (data) {
        callRfcCount = callRfcCount - 1;
        if (data == 'login error') {
            $('body').html(body_disconnected);
        } else {
            $(PlaceName).html(data);
        }
    });
    Param['sap-password'] = '';
    localStorage.setItem(Param['sap-user'] + PlaceName, CallType);
    localStorage.setItem(Param['sap-user'] + PlaceName + 'Param', JSON.stringify(Param));
}

$(document).ready(function () {
    body_disconnected = $('body').html();
});