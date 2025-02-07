const express = require("express");
const http = require("http");
const app = express();

const port = 3211;
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("DemoECS_Database.db");

app.set("view engine", "pug");
app.set("views", "./src/pug");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.locals.pretty = true;

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS RACK(
            RACK_NAME TEXT,
            ISFULL BOOLEAN NOT NULL
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS PORT(
            PORT_NAME TEXT,
            ISFULL BOOLEAN NOT NULL
        );
    `);
});

app.get('/', (req, res) => {
    res.render("ECS_P");
});


//DB의 데이터를 가져와 화면에  보이게하기**********************************
//DB의 데이터를 가져와 화면에  보이게하기**********************************
//DB의 데이터를 가져와 화면에  보이게하기**********************************
app.get('/DB_View', (req, res) => {
    let DB_RACK_Select = "SELECT * FROM RACK";
    let DB_PORT_Select = "SELECT * FROM PORT";
    db.all(DB_RACK_Select, (err, RACK_result) => {
        if (err) {
            return res.status(500).json({ err: err });
        }
        db.all(DB_PORT_Select, (err, PORT_result) => {
            if (err) {
                return res.status(500).json({ err: err });
            }
            res.json({
                RACK_value: RACK_result,
                PORT_value: PORT_result
            });
        });
    });
});
//DB의 데이터를 가져와 화면에  보이게하기**********************************
//DB의 데이터를 가져와 화면에  보이게하기**********************************
//DB의 데이터를 가져와 화면에  보이게하기**********************************







/************************Rack 높이 참고용*************************
************************Rack 높이 참고용*************************
************************Rack 높이 참고용*************************
let Fork_Load_1 = {
    "end_height": 0.38,
    "operation": "ForkLoad",
    "rec_height": 0.33,
    "recfile": "multi/m1.multi",
    "recognize": true,
    "start_height": 0.33
}

let Fork_Unload_1 = {
    "end_height": 0.33,
    "operation": "ForkUnload",
    "recognize": false,
    "start_height": 0.38
}

let Fork_Load_2 = {
    "end_height": 1.7,
    "operation": "ForkLoad",
    "rec_height": 1.64,
    "recfile": "multi/m1.multi",
    "recognize": true,
    "start_height": 1.64
}

let Fork_Unload_2 = {
    "end_height": 1.64,
    "operation": "ForkUnload",
    "recognize": false,
    "start_height": 1.7
}

let Fork_Load_3 = {
    "end_height": 3,
    "operation": "ForkLoad",
    "rec_height": 2.94,
    "recfile": "multi/m1.multi",
    "recognize": true,
    "start_height": 2.94
}

let Fork_Unload_3 = {
    "end_height": 2.94,
    "operation": "ForkUnload",
    "recognize": false,
    "start_height": 3
}

************************Rack 높이 참고용*************************
************************Rack 높이 참고용*************************
************************Rack 높이 참고용*************************/


let load_value;

function Fork_Transport(id_value_1, source_id_value_1, fork_mid_height_value_1, id_value_2, source_id_value_2, end_height_value_1, rec_height_value_1, start_height_value_1, id_value_3, source_id_value_3, id_value_4, source_id_value_4, fork_mid_height_value_2, id_value_5, source_id_value_5, fork_mid_height_value_3, id_value_6, source_id_value_6, end_height_value_2, start_height_value_2, id_value_7, source_id_value_7, id_value_8, source_id_value_8, fork_mid_height_value_4) {
    let now = Date.now();
    load_value = {
        "move_task_list": [
            {
                "id": id_value_1,
                "source_id": source_id_value_1,
                "task_id": `${now}`,
                "operation": "ForkHeight",
                "fork_mid_height": fork_mid_height_value_1
            },
            {
                "id": id_value_2,
                "source_id": source_id_value_2,
                "task_id": `${now}a`,
                "end_height": end_height_value_1,
                "operation": "ForkLoad",
                "rec_height": rec_height_value_1,
                "recfile": "multi/m1.multi",
                "recognize": true,
                "start_height": start_height_value_1
            },
            {
                "id": id_value_3,
                "source_id": source_id_value_3,
                "task_id": `${now}b`,
            },
            {
                "id": id_value_4,
                "source_id": source_id_value_4,
                "task_id": `${now}c`,
                "operation": "ForkHeight",
                "fork_mid_height": fork_mid_height_value_2
            },
            //
            {
                "id": id_value_5,
                "source_id": source_id_value_5,
                "task_id": `${now}d`,
                "operation": "ForkHeight",
                "fork_mid_height": fork_mid_height_value_3
            },
            {
                "id": id_value_6,
                "source_id": source_id_value_6,
                "task_id": `${now}e`,
                "end_height": end_height_value_2,
                "operation": "ForkUnload",
                "start_height": start_height_value_2
            },
            {
                "id": id_value_7,
                "source_id": source_id_value_7,
                "task_id": `${now}f`,
            },
            {
                "id": id_value_8,
                "source_id": source_id_value_8,
                "task_id": `${now}g`,
                "operation": "ForkHeight",
                "fork_mid_height": fork_mid_height_value_4
            }
        ]
    }
    return load_value;
}

let table_name_load;
let port_id_load;
let table_name_unload;
let port_id_unload;

let id_1;
let id_2;
let id_3;
let id_4;
let id_5;
let id_6;
let id_7;
let id_8;

let source_id_1;
let source_id_2;
let source_id_3;
let source_id_4;
let source_id_5;
let source_id_6;
let source_id_7;
let source_id_8;

let fork_mid_height_1;
let fork_mid_height_2;
let fork_mid_height_3;
let fork_mid_height_4;

let end_height_1;
let end_height_2;

let rec_height_1;

let start_height_1;
let start_height_2;

function Start_Robot(from_value, to_value) {

    //From From From
    //Level 1
    if (from_value[0] == "1") {
        fork_mid_height_1 = 0.33;
        end_height_1 = 0.38;
        rec_height_1 = 0.33;
        start_height_1 = 0.33;
        fork_mid_height_2 = 0.33;
        //Column
        if (from_value[2] == "1") {

            source_id_1 = "LM19";
            id_1 = "LM14";

            source_id_2 = "LM14";
            id_2 = "AP7";

            source_id_3 = "AP7";
            id_3 = "LM14";

            source_id_4 = "LM14";
            id_4 = "LM19";

        } else if (from_value[2] == "2") {

        } else if (from_value[2] == "3") {

        }

        //Level 2
    } else if (from_value[0] == "2") {
        fork_mid_height_1 = 1.64;
        end_height_1 = 1.7;
        rec_height_1 = 1.64;
        start_height_1 = 1.64;
        fork_mid_height_2 = 0.33;
        //Column
        if (from_value[2] == "1") {

            source_id_1 = "LM19";
            id_1 = "LM14";

            source_id_2 = "LM14";
            id_2 = "AP7";

            source_id_3 = "AP7";
            id_3 = "LM14";

            source_id_4 = "LM14";
            id_4 = "LM19";

        } else if (from_value[2] == "2") {

        } else if (from_value[2] == "3") {

        }
        //Level 3
    } else if (from_value[0] == "3") {
        fork_mid_height_1 = 2.94;
        end_height_1 = 3;
        rec_height_1 = 2.94;
        start_height_1 = 2.94;
        fork_mid_height_2 = 0.33;
        //Column
        if (from_value[2] == "1") {

            source_id_1 = "LM19";
            id_1 = "LM14";

            source_id_2 = "LM14";
            id_2 = "AP7";

            source_id_3 = "AP7";
            id_3 = "LM14";

            source_id_4 = "LM14";
            id_4 = "LM19";

        } else if (from_value[2] == "2") {

        } else if (from_value[2] == "3") {

        }
    } else if (from_value[0] == "A") {
        //Port
    } else if (from_value[0] == "B") {
    } else if (from_value[0] == "C") {
    } else if (from_value[0] == "D") {
    }



    //To To To
    //Level 1
    if (to_value[0] == "1") {
        //Column
        if (to_value[2] == "1") {

        } else if (to_value[2] == "2") {

        } else if (to_value[2] == "3") {

        }

        //Level 2
    } else if (to_value[0] == "2") {
        //Level 3
    } else if (to_value[0] == "3") {
    } else if (to_value[0] == "A") {
    } else if (to_value[0] == "B") {
    } else if (to_value[0] == "C") {
        source_id_5 = "LM43";
        id_5 = "LM17";
        fork_mid_height_3 = 0.8;

        source_id_6 = "LM17";
        id_6 = "AP45";
        start_height_2 = 0.8;
        end_height_2 = 0.62;

        source_id_7 = "AP45";
        id_7 = "LM17"

        source_id_8 = "LM17";
        id_8 = "LM43";
        fork_mid_height_4 = 0.33;
    } else if (to_value[0] == "D") {
        //Port
        source_id_5 = "LM42";
        id_5 = "LM18";
        fork_mid_height_3 = 0.8;

        source_id_6 = "LM18";
        id_6 = "AP11";
        start_height_2 = 0.8;
        end_height_2 = 0.62;

        source_id_7 = "AP11";
        id_7 = "LM18"

        source_id_8 = "LM18";
        id_8 = "LM42";
        fork_mid_height_4 = 0.33;
    }
    //로봇 실행
    let robot_data = Fork_Transport(id_1, source_id_1, fork_mid_height_1, id_2, source_id_2, end_height_1, rec_height_1, start_height_1, id_3, source_id_3, id_4, source_id_4, fork_mid_height_2, id_5, source_id_5, fork_mid_height_3, id_6, source_id_6, end_height_2, start_height_2, id_7, source_id_7, id_8, source_id_8, fork_mid_height_4);
    console.log(robot_data);
    F_Move(robot_data);
    id_1;
    id_2;
    id_3;
    id_4;
    id_5;
    id_6;
    id_7;
    id_8;

    source_id_1;
    source_id_2;
    source_id_3;
    source_id_4;
    source_id_5;
    source_id_6;
    source_id_7;
    source_id_8;

    fork_mid_height_1;
    fork_mid_height_2;
    fork_mid_height_3;
    fork_mid_height_4;

    end_height_1;
    end_height_2;

    rec_height_1;

    start_height_1;
    start_height_2;
}

























//***************************************************************************** */
//***************************************************************************** */
//***************************************************************************** */
//***************************************************************************** */
//test_status

function STATUS() {
    const options = {
        hostname: "192.168.0.164",
        port: 8088,
        path: "/robotsStatus",
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    }
    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log("로봇 데이터 현황");
                let json_parse_data = JSON.parse(responseData);
                //console.log(json_parse_data.report[0].current_order);
                console.log("**************************************");
                console.log(json_parse_data.report[0].vehicle_id);

                //연결된 로봇의 수를 파악해 CDD16를 추출해 상태값
                let vehicle_length = json_parse_data.report.length;

                for (let i = 0; i < vehicle_length; i++) {
                    if (json_parse_data.report[i].vehicle_id == "CDD16") {
                        console.log("FIND!!");
                        //CDD16 아이디값 찾아서
                        console.log(json_parse_data.report[i].vehicle_id);
                        //작업 블록 값 가져오기
                        console.log(json_parse_data.report[i].current_order);

                        /*
                        초마다 STATUS 함수 실행해서 해당 Load하는 상태와 Unload 
                        하는 상태를 받아와서 DB 여기다가 수정하기 DB의 값을 수정하기
                        위해서 
                        let table_name_load;
                        let port_id_load;
                        let table_name_unload;
                        let port_id_unload;
                        에 값을 넣기

                        load status랑 unload status 구별해서 인터벌하고 각각
                        Finished 처리되면 클리어 인터벌로 종료
                        */
                    }
                }
            } else {
                console.log("로봇 상태오류 또는 응답 대기중");
            }
        });
    });
    req.on('error', (error) => {
        console.log("STATUS ERROR 발생", error);
    });
    req.end();
}




//test_move
function TEST() {
    let now = Date.now();
    start_value = `${now}abc`;
    const options = {
        hostname: "192.168.0.164",
        port: 8088,
        path: "/generalRobokitAPI",
        method: "POST",
        headers: {
            "content-Type": "application/json"
        }
    }
    const requestData_load =
    {
        "vehicle": "CDD16",
        "port": 19206,
        "code": 3051,
        "cmd": {
            "id": "LM47",
            "source_id": "LM49",
            "task_id": `${now}abc`
        }
    }
    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('응답이 성공적으로 처리되었습니다.');
            } else {
                console.log('테스트 에러 메시지:');
                console.log(responseData);
            }
        });
    });
    req.on('error', (error) => {
        console.error(error);
    })
    req.write(JSON.stringify(requestData_load));
    req.end();
}

//***************************************************************************** */
//***************************************************************************** */
//***************************************************************************** */
//***************************************************************************** */
//***************************************************************************** */
















//로봇 움직이기
function F_Move(robot_data) {
    let now = Date.now();
    const options = {
        hostname: "192.168.0.126",
        port: 8088,
        path: "/generalRobokitAPI",
        method: "POST",
        headers: {
            "content-Type": "application/json"
        }
    }
    const requestData_load =
    {
        "vehicle": "CDD16",
        "port": 19206,
        "code": 3051,
        "cmd": robot_data
    }
    /*

    // 机器人从 LM1 -> LM2 -> AP1 (then execute JackHeight）
    {
      "move_task_list": [
        {
        },
        {
            "id": "AP1",
            "source_id": "LM2",
            "task_id": "12344322",
            "operation": "JackHeight",
            "jack_height": 0.2
        },
        {
            "id": "AP1",
            "source_id": "LM2",
            "task_id": "12344321",
            "operation": "ForkHeight",
            "recfile": "multi/m1.multi",
            "fork_mid_height": 0.5
        }
      ]
    }
    */

    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('응답이 성공적으로 처리되었습니다.');
                console.log('테스트 응답 데이터:');
                console.log(responseData);
            } else {
                console.log('응답 요청이 실패하였습니다. 상태 코드:', res.statusCode);
                console.log('테스트 에러 메시지:');
                console.log(responseData);
            }
        });
    });
    req.on('error', (error) => {
        console.error(error);
    })
    req.write(JSON.stringify(requestData_load));
    req.end();
}



function TEST_Interval(value) {
    let A = setInterval(value, 500);
    setTimeout(() => {
        clearInterval(A);
    }, 10000)
}


app.listen(port, () => {
    console.log(`START! ${port}`);
});


app.post("/fork_move", (req, res) => {
    let getSendData = req.body;
    let fromData = getSendData.fromData;
    let toData = getSendData.toData;
    //Start_Robot(fromData, toData);
    //TEST_Interval(TEST);
    STATUS();
});






















//addDB
app.post("/addDB", (req, res) => {
    let addPort_value = req.body;
    let addPort_name = addPort_value.port_name;
    let table_check = Number(addPort_name[0]);
    if (!isNaN(table_check)) {
        let sql = "UPDATE RACK SET ISFULL = 1 WHERE RACK_NAME = ?"
        db.run(sql, [addPort_name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`${addPort_name} RACK에 데이터가 추가되었습니다.`);
            return res.send(`${addPort_name} RACK에 데이터가 추가되었습니다.`);
        });
    } else {
        console.log(addPort_name);
        let sql = "UPDATE PORT SET ISFULL = 1 WHERE PORT_NAME = ?"
        db.run(sql, [addPort_name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`${addPort_name} PORT에 데이터가 추가되었습니다.`);
            return res.send(`${addPort_name} PORT에 데이터가 추가되었습니다.`);
        });
    }
});

//deleteDB
app.post("/deleteDB", (req, res) => {
    let deletePort_value = req.body;
    let deletePort_name = deletePort_value.port_name;
    let table_check = Number(deletePort_name[0]);
    if (!isNaN(table_check)) {
        let sql = "UPDATE RACK SET ISFULL = 0 WHERE RACK_NAME = ?"
        db.run(sql, [deletePort_name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`${deletePort_name} RACK에 데이터가 삭제되었습니다.`);
            return res.send(`${deletePort_name} RACK에 데이터가 삭제되었습니다.`);
        });
    } else {
        let sql = "UPDATE PORT SET ISFULL = 0 WHERE PORT_NAME = ?"
        db.run(sql, [deletePort_name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`${deletePort_name} PORT에 데이터가 삭제되었습니다.`);
            return res.send(`${deletePort_name} PORT에 데이터가 삭제되었습니다.`);
        });
    }
});






















/*
문제

1. 코어가 데이터를 읽는 시간이 짧아 연속으로 데이터를 줘야한다.
2. 연속으로 데이터를 강제입력하면 RDS에서 작업이 뜨지 않는다
3. SEER에서 버그를 수정하길 기다려야하며, 테스트용으로만 연달아 값 주기
4. STATUS 상태값 가져오기 -> RDS에 작업지시가 안떠서 아직 못가져오는 듯
*/