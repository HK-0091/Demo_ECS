/*
$(".box > .btn").click(()=>{
    console.log("load click!")
    $.ajax({
        url: "/fork_load",
        type: "POST",
        contentType: "application/json",
        data:JSON.stringify({ data: "fork_load START!"}),
        timeout: 3000,
        success: function(responseData){

        },
        error: function(xhr, status, err){
            console.log(err);
        }
    });
});
*/

// 메뉴 클릭 시 해당 창 나타나며, 메뉴 배경색 변경
$(document).ready(() => {
    $(".menu").on("click", function () {
        $(".menu").removeClass("select_menu")
        $(this).addClass("select_menu");

        //클릭한 메뉴의 아이디 값을 가져와 user+아이디값을 이용해 해당 박스 on/off
        let get_menu_id = $(this).attr("id");
        $(".UserContent > div").css("display", "none");
        $(`.user_${get_menu_id}`).css("display", "block");
    });
});

//Fork Transport From To 해당 위치 값 Input안에 삽입하기
let inputforcus = null;
$("#input_f_from").on("focus", function () {
    inputforcus = this;
    //해당 포커스된 input의 객체를 가져옴, 포커싱을 했다 정도로 생각
});

$("#input_f_to").on("focus", function () {
    inputforcus = this;
});

$(".numbering").click(function () {
    if (inputforcus) {
        let numbering_text = $(this).text();
        $(inputforcus).val(numbering_text);
    }
    inputforcus = null;
});


//페이지의 from과 to를 비교하는 변수
let from_compare_value;
let to_compare_value;
let from_value;
let to_value;

//From과 To의 데이터를 비교해 동일한 위치의 값을 받아오는 것을 방지!
$("#f_send").click(() => {
    from_value = $("#input_f_from").val();
    to_value = $("#input_f_to").val();
    from_compare_func(from_value);
    to_compare_func(to_value);
    compare_func(from_compare_value, to_compare_value);
});

function from_compare_func(value) {
    if (value[0] == "1" || value[0] == "2" || value[0] == "3") {
        from_compare_value = "A";
    } else if (value[0] == null) {
        from_compare_value = "C";
    } else {
        from_compare_value = "B";
    }
}

function to_compare_func(value) {
    if (value[0] == "1" || value[0] == "2" || value[0] == "3") {
        to_compare_value = "A";
    } else if (value[0] == null) {
        to_compare_value = "D";
    } else {
        to_compare_value = "B";
    }
}

//from과 to를 비교
function compare_func(result_1, result_2) {
    if (result_1 == result_2) {
        //알람처리하기
        console.log("same");
    } else {
        Data_SendServer(from_value, to_value);
    }
}

//from 과 to의 데이터를 서버로 전송
function Data_SendServer(fromData, toData) {

    let from_text = $("#input_f_from").val();
    let from_background_color = $(`#${from_text}`).css("background-color");

    $.ajax({
        url: "/fork_move",
        type: "POST",
        contentType: "application/json",
        timeout: 3000,
        //data에 background는 from에서 to로 이동시에 from에 배경색이 변하지 않으면 전송 안되게 막기위해 해당 배경색 전달
        data: JSON.stringify({ fromData: fromData, toData: toData, background: from_background_color}),
        success: function (responseData) {
            console.log(responseData);
            $(".UserContent2").css("display", "flex");
            dot_func();
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    })
}

/*
1. 완료되면 Interval 멈추고, DB 수정 테스트 해보기 4번이 해결되어야함.
2. Cancle 누르면 작업 멈추기
3. fork_move에 res.send() 위치 변경, 로봇이 작업이 들어간 후 실행되게
4. 문제: 서버에서 작업이 완료가 되면 그것을 클라이언트로 보내는 작업을 웹소켓으로 하려함 테스트중
*/


//from, to 입력 후 send 눌렀을때 나오는 실행중인 창 
let dot_setInterval;
function dot_func() {
    $(`.running_cancle`).attr("id", "dot_cancle");
    $(`.running_cancle`).text("Cancle");
    let dot_count = 1;
    dot_setInterval = setInterval(() => {
        if (dot_count > 7) {
            dot_count = 1;
        }
        $(`.dot`).css("background-color", "white");
        $(`.dot${dot_count}`).css("background-color", "red");
        dot_count++;
    }, 100);
}

$(".running_cancle").click(() => {
    clearInterval(dot_setInterval);
    $(".UserContent2").css("display", "none");
    //로봇 명령 멈추게 하기
});















/*
$(document).ready(function () {
    const ws = new WebSocket('ws://localhost:3210');

    // WebSocket 연결이 열렸을 때
    ws.onopen = function () {
        console.log('WebSocket 연결 열림');
    };

    // 서버로부터 메시지를 수신했을 때
    ws.onmessage = function (event) {
        console.log('서버로부터 수신한 메시지:', event.data);
    };

    // 버튼 클릭 시 서버로 메시지 전송
    $(document).click(function () {
        const message = JSON.stringify({ action: 'sayHello', payload: '안녕하세요, 서버!' });
        ws.send(message);
    });
});
*/



/*
RDS 명령주기 테스트 완료
$(document).click(() => {
    $.ajax({
        url: "/TEST_TASK",
        type: "POST",
        contentType: "application/json",
        timeout: 3000,
        success: function (responseData) {
            console.log(responseData);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
});
*/