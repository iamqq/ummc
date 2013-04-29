callRfcCount = 0;
sap_user = localStorage.getItem('sap-user');

function SetAutocomplete(Place, Url, StartLength, Log) {
    $(Place).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: Url,
                type: "POST",
                data: {
                    "sap-user": localStorage.getItem('sap-user'),
                    "sap-password": localStorage.getItem('sap-password'),
                    "find_text": request.term
                },
                success: function (data) {
                    var res = JSON.parse(data);
                    response($.map(res.data, function (item) {
                        return {
                            label: item.label,
                            value: item.label,
                            key: item.value
                        }
                    }));
                }
            })
        },
        minLength: StartLength,
        select: function (event, ui) {
            //      $("<p/>").text(ui.item ? ui.item.value : "Ничего не выбрано!").prependTo(Log);
            $(Log).attr("value", ui.item.key);
        }
    });
}

function DrawLogin() {
    $('#btnInOut').html('<div class="ummc_panel panel_button rs2" style="float:left;"><div class="tr_1">Выход</div></div>');
    $('#filesapuser').remove();
    $('#filesappassword').remove();
    $('<input>').attr({
        type: 'hidden',
        id: 'filesapuser',
        name: 'sap-user',
        value: localStorage.getItem('sap-user')
    }).appendTo('#file_upload');
    $('<input>').attr({
        type: 'hidden',
        id: 'filesappassword',
        name: 'sap-password',
        value: localStorage.getItem('sap-password')
    }).appendTo('#file_upload');
}

function DrawLogout() {
    localStorage.clear();
    $('#btnInOut').html('<div class="ummc_panel panel_button rs2" style="float:left;"><div class="tr_1">Вход</div></div>');
    $("#UserName").html('&nbsp;');
    $('#filesapuser').remove();
    $('#filesappassword').remove();
    CallRfc('main', '#MainScreen', {});
}

function download(url, data) {
    if (url && data) { 
        var inputs = '';
        for (var key in data) {
            inputs += '<input type="hidden" name="' + key + '" value="' + data[key] + '" />';
        } 
            jQuery('<form action="' + url + '" method="post" target="file">' + inputs +
            '</form>').appendTo('body').submit().remove();

    };
};

function fileDownload(url, Param) {
    Param['sap-user'] = localStorage.getItem('sap-user');
    Param['sap-password'] = localStorage.getItem('sap-password');
    download(url, Param);
}

function CallHideRfc(CallType, PlaceName, Param) {
    Param['sap-user'] = localStorage.getItem('sap-user');
    Param['sap-password'] = localStorage.getItem('sap-password');
    $.post(CallType, Param, function (data) {
        if (data != 'login error') $(PlaceName).html(data);
        if ($(PlaceName).html().replace(/[^\w]/g, "") == '0') $(PlaceName).closest("a").replaceWith(function () {
                return $("<span>" + $(PlaceName).closest("a").html() + "</span>");
            });
    });
}

function CallRfc(CallType, PlaceName, Param) {
    Param['sap-user'] = localStorage.getItem('sap-user');
    Param['sap-password'] = localStorage.getItem('sap-password');
    callRfcCount = callRfcCount + 1;
//    if (callRfcCount == 1) $("#Query").modal('show');
    $.post(CallType, Param, function (data) {
        callRfcCount = callRfcCount - 1;
        if (callRfcCount <= 0) $("#Query").modal('hide');
//        if (data == 'login error') {
            DrawLogout();
        } else {
            $(PlaceName).html(data + '&nbsp;');
        }
    });
    Param['sap-password'] = '';
    localStorage.setItem(Param['sap-user'] + PlaceName, CallType);
    localStorage.setItem(Param['sap-user'] + PlaceName + 'Param', JSON.stringify(Param));
}

function CallRfcInput(CallType, PlaceName, Param, GetParam) {
    callRfcCount = 0;
    for (var i = 0; i < GetParam.values.length; i++) {
        Param[GetParam.values[i].name] = $(GetParam.values[i].value).val();
    }
    CallRfc(CallType, PlaceName, Param);
}

function DocumentInit() {
    callRfcCount = 0;
    CallRfc('username', '#UserName', {});
    sap_user = localStorage.getItem('sap-user');
    if (sap_user != '' && sap_user != null) {
        DrawLogin();
    } else {
        DrawLogout();
    }
    var LastMain = localStorage.getItem(localStorage.getItem('sap-user') + '#MainScreen');
    var LastParam = JSON.parse(localStorage.getItem(localStorage.getItem('sap-user') + '#MainScreen' + 'Param'));
    if (LastMain != '' && LastMain != null) {
        CallRfc(LastMain, '#MainScreen', LastParam);
    } else {
        CallRfc('main', '#MainScreen', {});
    }
}

$(document).ready(function () {
    callRfc('body_connected','body',{})
    $("#login").on('shown', function () {
        $("#inputUser").val(localStorage.getItem('sap-user'));
        $("#inputPassword").val(localStorage.getItem('sap-password'));
        $("#inputUser").focus()
    })

    $("#btnInOut").click(function () {
        sap_user = localStorage.getItem('sap-user');
        if (sap_user != '' && sap_user != null) {
            DrawLogout();
        } else {
            DrawLogin();
            $("#login").modal('show');
        }
    })

    $("#btnLogin").click(function () {
        callRfcCount = 0;
        sap_user = $("#inputUser").val();
        if (sap_user != '' && sap_user != null) {
            //            DrawLogin();
            localStorage.setItem('sap-user', $("#inputUser").val());
            localStorage.setItem('sap-password', $("#inputPassword").val());
            $("#login").modal('hide');
            DocumentInit();
        } else {
            DrawLogout();
        }
    })
    DocumentInit();
});