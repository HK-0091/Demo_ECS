$("#button").click(() => {
    $.ajax({
        url: "/hiworks_submit",
        type: "POST",
        contentType: "application/json",
        timeout: 3000,
        success: function (responseData) {
            console.log(responseData);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    })
})