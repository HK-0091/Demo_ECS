let selectPortID;
$('.port').click(function () {
    //External DB 메뉴가 선택되면 클래스에 menu select_menu가 뜨고 거기에 5번째 s를 가져와 선택된 상태인지 확인하는 것
    let select_external_check = $("#external_db").attr("class")[5];
    if (select_external_check == "s") {
        $(".modify_modal").css("display", "block");
        let selectPort = this;
        selectPortID = $(selectPort).attr("id");
        $(".modify_modal_headerArea").text(`Do you want to modify the "${selectPortID}"?`);
    }
});

function modal_reset() {
    $(".modify_modal").css("display", "none");
    $('.modify_modal').css({
        height: "10rem"
    });
}

$("#external_db").click(() => {
    modal_reset();
});
$(".cancleBtn").click(() => {
    modal_reset();
});


//Add POD 누르면 DB 추가하기하고 화면에 바로 적용하기
$('#addBtn').click(() => {
    $('.modify_modal').css({
        height: "14rem"
    })
});













$('#add_TPMA').click(() => {
    $.ajax({
        url: "/addDB_TPMA",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ port_name: selectPortID }),
        timeout: 3000,
        success: function (responseData) {
            $(".modify_modal").css("display", "none");
            DB_PORT_VIEW();
            console.log(responseData);
            //완료가 되면 화면에 다시 띄우게 하려는데 서버 측 addDB는 수정이 됐는데 success 부분이 실행이 안됨
            //그 이유는 서버측 addDB에서 res.send로 클라이언트한테 피드백을 안줘서 success 내용 자체가 실행이 안된 것
            //즉, 클라이언트에게 데이터를 안줘도 피드백을 줘야 클라이언트 success라인 실행이 가능하다.
        },
        error: function (status, xhr, error) {
            console.log(error);
        }
    });
    modal_reset();
});

$('#add_TPMB').click(() => {
    $.ajax({
        url: "/addDB_TPMB",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ port_name: selectPortID }),
        timeout: 3000,
        success: function (responseData) {
            $(".modify_modal").css("display", "none");
            DB_PORT_VIEW();
            console.log(responseData);
        },
        error: function (status, xhr, error) {
            console.log(error);
        }
    });
    modal_reset();
});


//Add POD 누르면 DB 추가하기하고 화면에 바로 적용하기
$('#deleteBtn').click(() => {
    $.ajax({
        url: "/deleteDB",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ port_name: selectPortID }),
        timeout: 3000,
        success: function (responseData) {
            $(".modify_modal").css("display", "none");
            DB_PORT_VIEW();
        },
        error: function (status, xhr, error) {
            console.log(error);
        }
    });
});
/*
mysql, sqlite3 모두 commit을 따로 하지 않아도 자동 commit이 되며, DB에 자동으로 영구 저장이 된다.
*/