$(document).ready(() => {
    DB_PORT_VIEW();
});


function DB_PORT_VIEW() {
    $.ajax({
        url: "/DB_View",
        type: "GET",
        contentType: "application/json",
        timeout: 3000,
        data: {},
        success: function (responseData) {
            let RACK_length = responseData.RACK_value.length;
            let PORT_length = responseData.PORT_value.length;
            for (let i = 0; i < RACK_length; i++) {
                let RACK_NAME = responseData.RACK_value[i].RACK_NAME;
                let RACK_ISFULL = responseData.RACK_value[i].ISFULL;
                let RACK_TYPE = responseData.RACK_value[i].TYPE;
                if (RACK_ISFULL == 1) {
                    if (RACK_TYPE == "TPMB") {
                        $(`#${RACK_NAME}`).css("background-color", "#da4f46");
                    } else {
                        $(`#${RACK_NAME}`).css("background-color", "#2154A6");
                    }
                } else {
                    $(`#${RACK_NAME}`).css("background-color", "#1E5A5E");
                }
            }
            for (let i = 0; i < PORT_length; i++) {
                let PORT_NAME = responseData.PORT_value[i].PORT_NAME;
                let PORT_ISFULL = responseData.PORT_value[i].ISFULL;
                let PORT_TYPE = responseData.PORT_value[i].TYPE;
                if (PORT_ISFULL == 1) {
                    if (PORT_TYPE == "TPMB") {
                        $(`#${PORT_NAME}`).css("background-color", "#da4f46");
                    } else {
                        $(`#${PORT_NAME}`).css("background-color", "#2154A6");
                    }
                } else {
                    $(`#${PORT_NAME}`).css("background-color", "#1E5A5E");
                }
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

