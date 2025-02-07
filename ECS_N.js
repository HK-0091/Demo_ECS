//http = 상대 API에 GET 또는 POST를 보내기 위함
//express = 내 서버에 GET 또는 POST의 API를 설정하는 것으로 다른 이들이 이를 통해 내 서버와 통신가능
//Websocket 
// 클라이언트(나) -> 서버: 웹소켓 모듈 설정 및 웹소켓 객체 형성하여 "서버 IP연결"
// 서버(나) -> 클라이언트: 웹소켓 모듈 설정 및 웹소켓 객체 형성하여 "내 IP연결"


const { table } = require("console");
const express = require("express");
const app = express(); //ajax를 사용해 특정 서버로 데이터 전송은 가능, 브라우저(**.js파일) -> 서버(node.js등)이며, Path 기재가 없음! ***단순히 서버 -> 서버는 http.request사용, 브라우저 -> 서버는 ajax 사용 권장***
const http = require("http"); //Node.js 서버 -> 서버로 데이터 전송을 할 때 사용(option에 path 기재)
const WebSocket = require('ws'); //내가 클라이언트 입장에서라면 해당 웹소켓 모듈만 있으면 된다. 웹소켓 생성까지는 필요 없다.
const port = 3210;
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("DemoECS_Database.db");
const httpServer = app.listen(port, () => { //해당 부분은 내가 서버 입장에서 웹소켓을 설정하여, 내 서버와 연결하기 위함이며, 클라이언트가 내 서버에 접근 할 때 웹소켓을 만드는 과정이다.
    console.log(`START!! ${port}`); //내 서버를 변수에 담고
});
const wss = new WebSocket.Server({ server: httpServer }); // 웹소켓을 생성해 내 서버와 연결시킨다. 이후 wws.on('message',()=>{}) 등으로 관리
/****************************************************************************************************
****************************************************************************************************
 특정 IP에 데이터를 전송하고자 한다면
 express와 http를 아래처럼 같이 사용한다고 보면 된다.

 중요한 것은

 1. 보내고자하는 IP의 데이터를 설정
    const options = {
        hostname: "192.168.0.20",
        port: 8088,
        path: "/setOrder",
        method: "POST",
        headers: {
            "content-Type": "application/json"
        }
    }

2. 보내고자하는 JSON 형식 설정(API문서를 참고하여 해당 데이터에 맞게 기술)
    const example = {
        "fromOrder": {
            "id": `${now}B`,
            "blocks": [
                { "blockId": `${now}E`, "location": "L6_1", "binTask": "Fork_Load_2" },
            ],
            "complete": true
        }
    }

3. http.request를 변수에 담기
    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            
            responseData += chunk;
        });

            1. res는 서버에 대한 응답 객체이다.
            2. chunk는 데이터(example)를 전달 후 서버로부터 받은 데이터의 버퍼형식의 각 값들을 Chunk에 담아 
            3. responseData로 하나의 데이터로 만든다.
            4. res.on('end',()=>{}) 는 서버로부터 모든 데이터를 전송 받은 후 콜백함수로 처리하겠다는 것이다.
                4-1 버퍼데이터 Chunk가 오다가 오류가 나면 오튜를 처리, 정상으로 왔으면 정상처리등의 작업을 하는 곳이다.

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('요청이 성공적으로 처리되었습니다.');
            } else {
                console.log('요청이 실패하였습니다. 상태 코드:', res.statusCode);
            }
        });
    });

4. 해당 데이터를 본문작성, 전달, 오류처리
    4-1 오류처리
        req.on("error",(err)=>{
            console.log(err);
        });

    4-2 본문작성(보내기전에 문법을 작성한다고 생각하자 어디에 저장되었다 전달되는지는 잘 모르겠다.)
        req.write(JSON.stringify(example));

    4-3 전달
        req.end();

****************************************************************************************************
****************************************************************************************************
*****/



//createDatabases
//A:1100*1100
//B:1200*1000
//C:1200*1000 or 1100*1100
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS RACK(
            RACK_NAME TEXT,
            ISFULL TEXT NOT NULL
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS PORT(
            PORT_NAME TEXT,
            ISFULL TEXT NOT NULL
        );
    `);
});

app.set("view engine", "pug");
app.set("views", "./src/pug");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.locals.pretty = true;

app.get('/', (req, res) => {
    res.render("ECS_P");
});

let Container_Finished_Move;
let Container_Start_Move;
let fork_interval_Start;
let fork_interval_End;

//Container_Move(Fork) Fork 이동시키는 로직이나, 현재로써는 사용 할 필요가 없다.
function Container_Move(load_level, load_column, unload_level, unload_column) {
    let now = Date.now();
    //id 값 받아오기
    Container_Finished_Move = `${now}H`;
    Container_Start_Move = `${now}E`;
    const options = {
        hostname: "192.168.0.20",
        port: 8088,
        path: "/setOrder",
        method: "POST",
        headers: {
            "content-Type": "application/json"
        }
    }
    const requestData_load = {
        "id": `${now}A`,
        "fromOrder": {
            "id": `${now}B`,
            "blocks": [
                { "blockId": `${now}E`, "location": `${load_column}`, "binTask": `${load_level}` },
            ],
            "complete": true
        },
        "toOrder": {

            "id": `${now}D`,
            "blocks": [
                { "blockId": `${now}H`, "location": `${unload_column}`, "binTask": `${unload_level}` },
            ],
            "complete": true
        },
        "group": "", //그룹 필히 지정 안해도 됨
        "goodsId": "", //상품의 아이디 미정시 자동으로 아이디 생성됨
        "vehicle": "CDD16"   //특정 AMR을 설정안하고 그룹으로 진행시 해당 그룹에 가까이있는 AMR이 자동으로 이동하여 작업진행
    }
    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('Container_Move() 응답이 성공적으로 처리되었습니다.');
                console.log('테스트 응답 데이터:');
                console.log(responseData);
                //작업 완료 후 변수 값 초기화 확인
            } else {
                console.log('Container_Move() 응답 요청이 실패하였습니다. 상태 코드:', res.statusCode);
                console.log('테스트 에러 메시지:');
                console.log(responseData);
            }
        });
    });
    req.on('error', (error) => {
        console.error('Container_Move() 요청 중 오류가 발생하였습니다:', error);
    })
    req.write(JSON.stringify(requestData_load));
    req.end();
}

//RACK에서 PORT로 전달하기
function RACK_To_PORT(Unload_val, Load_val, R_mid_val, R_mid_AP_val, P_mid_val, P_mid_AP_val, FL_level_val, FU_level_val) {
    console.log("Unload_val: " + Unload_val);
    console.log("Load_val: " + Load_val);
    console.log("R_mid_val: " + R_mid_val);
    console.log("R_mid_AP_val: " + R_mid_AP_val);
    console.log("P_mid_val: " + P_mid_val);
    console.log("P_mid_AP_val: " + P_mid_AP_val);
    console.log("FL_level_val: " + FL_level_val);
    console.log("FU_level_val: " + FU_level_val);
    let now = Date.now();
    const options = {
        hostname: "192.168.0.20",
        port: 8088,
        path: "/setOrder",
        method: "POST",
        headers: {
            "content-Type": "application/json"
        }
    }
    const requestData_load = {
        "blocks": [
            {
                "blockId": `${now}1`,
                "location": "LM51",
            },
            {
                "blockId": `${now}2`,
                "location": R_mid_val
            },
            {
                "blockId": `${now}3`,
                "binTask": `${FL_level_val}`,
                "location": R_mid_AP_val
            },
            {
                "blockId": `${now}4`,
                "binTask": FL_level_val,
                "location": Load_val
            },
            {
                "blockId": `${now}5`,
                "location": R_mid_AP_val
            },
            {
                "blockId": `${now}6`,
                "binTask": "Fork_Load_1",
                "location": R_mid_val
            },
            {
                "blockId": `${now}7`,
                "location": "LM56"
            },
            {
                "blockId": `${now}8`,
                "location": P_mid_val
            },
            {
                "blockId": `${now}9`,
                "binTask": FU_level_val,
                "location": P_mid_AP_val
            },
            {
                "blockId": `${now}10`,
                "binTask": FU_level_val,
                "location": Unload_val
            },
            {
                "blockId": `${now}11`,
                "location": P_mid_AP_val
            },
            {
                "blockId": `${now}12`,
                "binTask": "Fork_Unload_1",
                "location": P_mid_val
            },
            {
                "blockId": `${now}13`,
                "location": "LM51",
                "operation": "ForkHeight",
                "end_height": 0,
                "recognize": false
            }
        ],
        "complete": true,
        "id": `${now}99`,
        "postAction": {},
        "vehicle": "CDD16"
    }
    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('Container_Move() 응답이 성공적으로 처리되었습니다.');
                console.log('테스트 응답 데이터:');
                console.log(responseData);
                //작업 완료 후 변수 값 초기화 확인
            } else {
                console.log('Container_Move() 응답 요청이 실패하였습니다. 상태 코드:', res.statusCode);
                console.log('테스트 에러 메시지:');
                console.log(responseData);
            }
        });
    });
    req.on('error', (error) => {
        console.error('Container_Move() 요청 중 오류가 발생하였습니다:', error);
    })
    req.write(JSON.stringify(requestData_load));
    req.end();
}

//PORT에서 RACK로 전달하기
function PORT_To_RACK(Unload_val, Load_val, R_mid_val, R_mid_AP_val, P_mid_val, P_mid_AP_val, FL_level_val, FU_level_val) {
    console.log("Unload_val: " + Unload_val);
    console.log("Load_val: " + Load_val);
    console.log("R_mid_val: " + R_mid_val);
    console.log("R_mid_AP_val: " + R_mid_AP_val);
    console.log("P_mid_val: " + P_mid_val);
    console.log("P_mid_AP_val: " + P_mid_AP_val);
    console.log("FL_level_val: " + FL_level_val);
    console.log("FU_level_val: " + FU_level_val);
    let now = Date.now();
    const options = {
        hostname: "192.168.0.20",
        port: 8088,
        path: "/setOrder",
        method: "POST",
        headers: {
            "content-Type": "application/json"
        }
    }
    //블럭아이디 수정하기
    const requestData_load = {
        "blocks": [
            {
                "blockId": `${now}1`,
                "location": "LM51"
            },
            {
                "blockId": `${now}2`,
                "location": P_mid_val
            },
            {
                "blockId": `${now}3`,
                "binTask": FL_level_val,
                "location": P_mid_AP_val
            },
            {
                "blockId": `${now}4`,
                "binTask": FL_level_val,
                "location": Load_val
            },
            {
                "blockId": `${now}5`,
                "location": P_mid_AP_val
            },
            {
                "blockId": `${now}6`,
                "binTask": "Fork_Load_1",
                "location": P_mid_val
            },
            {
                "blockId": `${now}7`,
                "location": "LM57"
            },
            {
                "blockId": `${now}8`,
                "location": R_mid_val
            },
            {
                "blockId": `${now}9`,
                "binTask": FU_level_val,
                "location": R_mid_AP_val
            },
            {
                "blockId": `${now}10`,
                "binTask": FU_level_val,
                "location": Unload_val
            },
            {
                "blockId": `${now}11`,
                "location": R_mid_AP_val
            },
            {
                "blockId": `${now}12`,
                "binTask": "Fork_Unload_1",
                "location": RACK_mid_height
            },
            {
                "blockId": `${now}13`,
                "location": "LM51",
                "operation": "ForkHeight",
                "end_height": 0,
                "recognize": false
            }
        ],
        "complete": true,
        "id": `${now}99`,
        "postAction": {},
        "vehicle": "CDD16"
    }
    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('Container_Move() 응답이 성공적으로 처리되었습니다.');
                console.log('테스트 응답 데이터:');
                console.log(responseData);
                //작업 완료 후 변수 값 초기화 확인
            } else {
                console.log('Container_Move() 응답 요청이 실패하였습니다. 상태 코드:', res.statusCode);
                console.log('테스트 에러 메시지:');
                console.log(responseData);
            }
        });
    });
    req.on('error', (error) => {
        console.error('Container_Move() 요청 중 오류가 발생하였습니다:', error);
    })
    req.write(JSON.stringify(requestData_load));
    req.end();
}




//Fork_Task_Start 현재로써는 아래 로직을 사용하지 않고 웹소켓을 사용할 것이다.
function Fork_StartStatus(table_name, port_id) {
    const options_status = {
        hostname: '192.168.0.20',
        port: 8088,
        path: `/orderDetailsByBlockId/${Container_Start_Move}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const req = http.request(options_status, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                let json_parse_data = JSON.parse(responseData);
                if (json_parse_data.blocks[0].state == "FINISHED") {
                    clearInterval(fork_interval_Start);
                    console.log("포크가 화물을 들었습니다!");
                    /*
                    let update_data_start = `UPDATE ${table_name} SET ISFULL = 0 WHERE ${table_name}_NAME = ?`;
                    db.run(update_data_start, [port_id], (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                        console.log(`${table_name}의 데이터 베이스가 삭제되었습니다!`);
                    });
                    */
                } else {
                    console.log("START");
                }
            }
        });
    });
    req.on('error', (error) => {
        console.error('요청 중 오류가 발생하였습니다:', error);
    })
    req.end();
}



//Fork_Task_End 현재로써는 아래 로직을 사용하지 않고 웹소켓을 사용할 것이다.
function Fork_EndStatus(table_name, port_id) {
    const options_status = {
        hostname: '192.168.0.20',
        port: 8088,
        path: `/orderDetailsByBlockId/${Container_Finished_Move}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const req = http.request(options_status, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                let json_parse_data = JSON.parse(responseData);
                if (json_parse_data.blocks[0].state == "FINISHED") {
                    clearInterval(fork_interval_End);
                    console.log("포크가 화물을 내려놓았습니다!");
                    /*
                    let update_data_end = `UPDATE ${table_name} SET ISFULL = 1 WHERE ${table_name}_NAME = ?`;
                    db.run(update_data_end, [port_id], (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                        console.log(`${table_name}의 데이터 베이스가 추가되었습니다!`)
                    });
                    완료가 되면 소켓통신으로 클라이언트에게 데이터를 완료 사인을 주고 
                    클라이언트가 사인을 받아 running task 창 끄기, 단순하게 cancle 버튼만
                    사용해서 작업 멈추게 하는 로직만 구현하자

                    */
                } else {
                    console.log("END");
                }
            }
        });
    });
    req.on('error', (error) => {
        console.error('요청 중 오류가 발생하였습니다:', error);
    })
    req.end();
}

//웹소켓 사용 예정
function Fork_Status_Interval_Start(table_name, port_id) {
    fork_interval_Start = setInterval(() => {
        Fork_StartStatus(table_name, port_id);
    }, 5000);
}

//웹소켓 사용 예정
function Fork_Status_Interval_End(table_name, port_id) {
    console.log("화물 내려놓기 인터벌 시작!");
    fork_interval_End = setInterval(() => {
        Fork_EndStatus(table_name, port_id);
    }, 5000);
}

//load
let forkLevel_load;
let forkColumn_load;
let table_name_load;
let pod_id_load;

//Unload
let forkLevel_unload;
let forkColumn_unload;
let table_name_unload;
let pod_id_unload;

//mid_height value
let RACK_mid_height;    //RACK 초입 mid_height 값 설정
let RACK_mid_height_AP; //RACK AP 전 LM mid_height 값 설정
let PORT_mid_height;    //PORT 초입 mid_height 값 설정
let PORT_mid_height_AP; //PORT AP 전 LM mid_height 값 설정

//페이지에 From, To에 따라 설정값을 주고자 하는 것이며, 아래는 수정이 필요한 사항이다.
function Start_Robot(from_value, to_value) {
    return new Promise((resolve, reject) => {
        //fork_Load
        if (from_value[0] == "1" || from_value[0] == "2" || from_value[0] == "3") {

            forkLevel_load = "Fork_Load_" + `${from_value[0]}`;
            table_name_load = "RACK";
            pod_id_load = from_value;
            if (from_value[2] == "1") {
                forkColumn_load = "L7_1";
                RACK_mid_height = "H19";
                RACK_mid_height_AP = "H14"
            } else if (from_value[2] == "2") {
                forkColumn_load = "L7_4";
                RACK_mid_height = "H55";
                RACK_mid_height_AP = "H54"
            } else {
                forkColumn_load = "";
                RACK_mid_height = "";
                RACK_mid_height_AP = ""
                //Roboshop pro RDS "rds_20240925085456.zip" MAP 기준으로 작성하여 "L7-9"는 현재 없는 상태
            }
        } else if (from_value[0] == "A") {
            table_name_load = "PORT";
            pod_id_load = "A";
            forkColumn_load = "";
            forkLevel_load = "Fork_Load_1";
            PORT_mid_height = "";
            PORT_mid_height_AP = "";
            //Roboshop pro RDS "rds_20240925085456.zip" MAP 기준으로 작성하여 "A PORT"는 현재 없는 상태
        } else if (from_value[0] == "B") {
            table_name_load = "PORT";
            pod_id_load = "B";
            forkColumn_load = "L48_1";
            forkLevel_load = "Fork_Load_1";
            PORT_mid_height = "H43";
            PORT_mid_height_AP = "H49";
        } else if (from_value[0] == "C") {
            table_name_load = "PORT";
            pod_id_load = "C";
            forkColumn_load = "L45_1";
            forkLevel_load = "Fork_Load_1";
            PORT_mid_height = "H43";
            PORT_mid_height_AP = "H17";
        } else if (from_value[0] == "D") {
            table_name_load = "PORT";
            pod_id_load = "D";
            forkColumn_load = "L11_1";
            forkLevel_load = "Fork_Load_1";
            PORT_mid_height = "H52";
            PORT_mid_height_AP = "H18";
        } else {
            console.log("FROM value 값 확인 필요");
        }

        //fork_Unload
        if (to_value[0] == "1" || to_value[0] == "2" || to_value[0] == "3") {
            forkLevel_unload = "Fork_Unload_" + `${to_value[0]}`;
            table_name_unload = "RACK";
            pod_id_unload = to_value;
            if (to_value[2] == "1") {
                forkColumn_unload = "L7_1";
                RACK_mid_height = "H19";
                RACK_mid_height_AP = "H14"

            } else if (to_value[2] == "2") {
                forkColumn_unload = "L22";
                RACK_mid_height = "H55";
                RACK_mid_height_AP = "H54"

            } else {
                forkColumn_unload = "L21";
                RACK_mid_height = "";
                RACK_mid_height_AP = ""
                //Roboshop pro RDS "rds_20240925085456.zip" MAP 기준으로 작성하여 "L7-9"는 현재 없는 상태

            }
        } else if (to_value[0] == "A") {
            table_name_unload = "PORT";
            pod_id_unload = "A";
            forkColumn_unload = "";
            forkLevel_unload = "Fork_Unload_1";
            PORT_mid_height = "";
            PORT_mid_height_AP = "";

            //Roboshop pro RDS "rds_20240925085456.zip" MAP 기준으로 작성하여 "A PORT"는 현재 없는 상태
        } else if (to_value[0] == "B") {
            table_name_unload = "PORT";
            pod_id_unload = "B";
            forkColumn_unload = "L48_1";
            forkLevel_unload = "Fork_Unload_1";
            PORT_mid_height = "H43";
            PORT_mid_height_AP = "H49";

        } else if (to_value[0] == "C") {
            table_name_unload = "PORT";
            pod_id_unload = "C";
            forkColumn_unload = "L45_1";
            forkLevel_unload = "Fork_Unload_1";
            PORT_mid_height = "H43";
            PORT_mid_height_AP = "H17";

        } else if (to_value[0] == "D") {
            table_name_unload = "PORT";
            pod_id_unload = "D";
            forkColumn_unload = "L11_1";
            forkLevel_unload = "Fork_Unload_1";
            PORT_mid_height = "H52";
            PORT_mid_height_AP = "H18";

        } else {
            console.log("TO value 값 확인 필요");
        }

        //From과 To의 값을 토대로 설정된 변수들을 리턴해 Container_Move_Task에 사용 할 예정이다.
        resolve({
            forkLevel_load,
            forkColumn_load,

            table_name_load, //DB 수정용
            pod_id_load,     //DB 수정용

            forkLevel_unload,
            forkColumn_unload,

            table_name_unload,
            pod_id_unload,

            PORT_mid_height,
            PORT_mid_height_AP
        });
    });
}

/************************* Robot starting area *************************/
/************************* Robot starting area *************************/
app.post("/fork_move", (req, res) => {
    let getSendData = req.body;
    let fromData = getSendData.fromData;
    let toData = getSendData.toData;
    let from_background_color = getSendData.background; //from의 background 색으로 DB가 입력이 되었는지, 어떤 타입(TPMA, TPMB)인지 판별하기 위함
    let pallet_type;

    //TPMA, TPMB 추가시 페이지 포트 부분의 배경색을 바꾸고 해당 배경을 통해 pallet_type 설정
    //설정된 pallet_type은 해당 위치에 TPMA, TPMB를 넣을 수 있는지 없는지 판별하는데 사용된다.
    Start_Robot(fromData, toData).then(result => {
        if (from_background_color == "rgb(218, 79, 70)") {
            pallet_type = "TPMB";
        } else if (from_background_color == "rgb(33, 84, 166)") {
            pallet_type = "TPMA";
        } else {
            pallet_type = undefined;
        }
        if (pallet_type == "TPMA" && result.pod_id_unload == "B" || pallet_type == "TPMB" && result.pod_id_unload == "D") {
            console.log(`${pallet_type}은 ${result.pod_id_unload}로 이동 할 수 없습니다.`);
        } else {
            console.log("로봇 실행");
            console.log("1. forkColumn_load: " + forkColumn_load);
            console.log("2. forkLevel_unload: " + forkLevel_unload);
            console.log("3. forkColumn_unload: " + forkColumn_unload);
            console.log("4. forkLevel_load: " + forkLevel_load);

            console.log("5. pod_id_load: " + pod_id_load);
            console.log("6. pod_id_unload: " + pod_id_unload);
            console.log("7. RACK_mid_height: " + RACK_mid_height);
            console.log("8. RACK_mid_height_AP: " + RACK_mid_height_AP);
            console.log("9. PORT_mid_height: " + PORT_mid_height);
            console.log("10. PORT_mid_height_AP: " + PORT_mid_height_AP);
            //값 잘 오는지 확인하고 아래 PORT_To_RACK등에도 추가하기


            //pod_id_load가 RACK(1-1), PORT(A) 중에 처음 시작 부분에 따라 함수 실행
            if (isNaN(pod_id_load[0])) {
                PORT_To_RACK(forkColumn_unload, forkColumn_load, RACK_mid_height, RACK_mid_height_AP, PORT_mid_height, PORT_mid_height_AP, forkLevel_load, forkLevel_unload);
            } else {
                RACK_To_PORT(forkColumn_unload, forkColumn_load, RACK_mid_height, RACK_mid_height_AP, PORT_mid_height, PORT_mid_height_AP, forkLevel_load, forkLevel_unload);
            }

            //실행 후 변수들 초기화 예정
            forkLevel_load;
            forkColumn_load;
            table_name_load;
            pod_id_load;
            forkLevel_unload;
            forkColumn_unload;
            table_name_unload;
            pod_id_unload;
            pallet_type;
        }
    });
    /*
    로봇 상태값을 가져오는 함수로, 현재로써는 웹소켓 사용 예정으로 테스트 중
    Fork_Status_Interval_Start(table_name_load, pod_id_load);
    Fork_Status_Interval_End(table_name_unload, pod_id_unload);
    */
    res.send();  //send위치 수정필요 로봇이 데이터를 제대로 받고 실행 후 send하기
});

//addDB_TPMA, TPMA를 추가하고자 하는데 PORT B부분은 추가 안되게 막음
app.post("/addDB_TPMA", (req, res) => {
    let addPort_value = req.body;
    let addPort_name = addPort_value.port_name;
    let table_check = Number(addPort_name[0]);
    if (!isNaN(table_check)) {
        let sql = `UPDATE RACK SET ISFULL = 1, TYPE = "TPMA" WHERE RACK_NAME = ?`
        db.run(sql, [addPort_name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`${addPort_name} RACK에 데이터가 추가되었습니다.`);
            return res.send(`${addPort_name} RACK에 데이터가 추가되었습니다.`);
        });
    } else {
        let sql = `UPDATE PORT SET ISFULL = 1, TYPE = "TPMA" WHERE PORT_NAME = ?`
        if (addPort_name == "B") {
            return res.send(`${addPort_name}에 TPMA를 추가 할 수 없습니다.`);
        } else {
            db.run(sql, [addPort_name], (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`${addPort_name} PORT에 데이터가 추가되었습니다.`);
                return res.send(`${addPort_name} PORT에 데이터가 추가되었습니다.`);
            });
        }
    }
});

//addDB_TPMB TPMB를 추가하고자 하는데 PORT D부분은 추가 안되게 막음
app.post("/addDB_TPMB", (req, res) => {
    let addPort_value = req.body;
    let addPort_name = addPort_value.port_name;
    let table_check = Number(addPort_name[0]);
    if (!isNaN(table_check)) {
        let sql = `UPDATE RACK SET ISFULL = 1, TYPE = "TPMB" WHERE RACK_NAME = ?`
        db.run(sql, [addPort_name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`${addPort_name} RACK에 데이터가 추가되었습니다.`);
            return res.send(`${addPort_name} RACK에 데이터가 추가되었습니다.`);
        });
    } else {
        console.log(addPort_name);
        let sql = `UPDATE PORT SET ISFULL = 1, TYPE = "TPMB" WHERE PORT_NAME = ?`
        if (addPort_name == "D") {
            return res.send(`${addPort_name}에 TPMB를 추가 할 수 없습니다.`);
        } else {
            db.run(sql, [addPort_name], (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`${addPort_name} PORT에 데이터가 추가되었습니다.`);
                return res.send(`${addPort_name} PORT에 데이터가 추가되었습니다.`);
            });
        }
    }
});

//deleteDB TPMA, TPMB 삭제시 TYPE 및 ISFULL 0으로 초기화
app.post("/deleteDB", (req, res) => {
    let deletePort_value = req.body;
    let deletePort_name = deletePort_value.port_name;
    let table_check = Number(deletePort_name[0]);
    if (!isNaN(table_check)) {
        let sql = "UPDATE RACK SET ISFULL = 0, TYPE = NULL WHERE RACK_NAME = ?"
        db.run(sql, [deletePort_name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`${deletePort_name} RACK에 데이터가 삭제되었습니다.`);
            return res.send(`${deletePort_name} RACK에 데이터가 삭제되었습니다.`);
        });
    } else {
        let sql = "UPDATE PORT SET ISFULL = 0, TYPE = NULL WHERE PORT_NAME = ?"
        db.run(sql, [deletePort_name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`${deletePort_name} PORT에 데이터가 삭제되었습니다.`);
            return res.send(`${deletePort_name} PORT에 데이터가 삭제되었습니다.`);
        });
    }
});

//DB의 데이터를 가져와 페이지에 포트 상태(TPMA, TPMB, Null)를 표기하기
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
/************************* Robot starting area *************************/
/************************* Robot starting area *************************/














//해당 웹소켓은 내가 클라이언트 입장에서 서버에서 이미 설정한 웹소켓에 연결하기 위한 것
//클라이언트인 내가 서버에 웹소켓을 연결하기 위해서는 해당 부분만 필요하며, 웹소켓 모듈만 불러오면 된다. const Websocket = require('ws');
function Seer_socketStatus() {
    let host_seer = "ws://192.168.0.20:8089/robotsStatus";  //연결하고자하는 서버의 웹소켓 주소
    const wss_seer = new WebSocket(host_seer);  //클라이언트인 내 서버에 웹소켓 객체 생성 후 서버 주소 넣어 내 웹소켓와 연결

    wss_seer.on('open', (ws) => {
        console.log("SEER SUCCESS!!"); //연결 완료 확인
    });

    wss_seer.on("message", (data) => {
        /*
        로봇 상태 값 파싱 로직
        let Robot_blocks = Robot_Status.report[0].current_order.blocks;
        */

        let Robot_Status = JSON.parse(data); //로봇 데이터 파싱
        let Robot_blocks_all = Robot_Status.report; //RDS에 연결된 모든 로봇 출력
        let Robot_quantity = Robot_Status.report.length; //RDS에 연결된 로봇 수 출력
        let Robot_array_number = 0; //CDD16이 몇 번째에 연결 되어있는지 저장하기 위한 변수
        for (let i = 0; i < Robot_quantity; i++) {  //로봇 개수만큼 반복
            if (Robot_blocks_all[i].vehicle_id == "CDD16") { //몇 번째에 CDD16이 있는지 확인
                Robot_array_number = i; //CDD16이 있는 인덱스 저장
                let CDD16_blocks = Robot_blocks_all[Robot_array_number].current_order.blocks;
                try {
                    if (CDD16_blocks[3].state == "FINISHED") {
                        console.log("화물을 들었습니다.");
                        DB_Modify_Func_Load();

                    }
                    if (CDD16_blocks[9].state == "FINISHED") {
                        console.log("화물을 내렸습니다.")
                        DB_Modify_Func_Unload();
                    }
                } catch { }
            }
        }
        /*
        console.log(CDD16_blocks[0].state);
        console.log(Robot_blocks_all[2].current_order.blocks[0].state);
        */
    });
}

//Load 완료 DB 수정 함수
function DB_Modify_Func_Load() {
    console.log("Load DB 수정");
    //table_name_Load = "PORT";
    //table_name_unload = "PORT";
    //pod_id_Load = "A";
    //pod_id_unload = "A";
    //활용하기
}


//UnLoad 완료 DB 수정 함수
function DB_Modify_Func_Unload() {
    console.log("Unload DB 수정");
}


Seer_socketStatus(); //소켓 실행 


/*
CASE_1-------------------------------------------
const WebSocket = require('ws');
const httpServer = app.listen(port, () => {
    console.log(`START!! ${port}`);
});
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection',(ws)=>{
    console.log("WebSocket 클라이언트가 연결되었습니다.");

    ws.send("안녕하세요, 클라이언트!");

    ws.on("message",(message)=>{
        console.log("수신한 메시지",JSON.parse(message));
        let client_say = JSON.parse(message);
        console.log(client_say.payload);
    })
});
CASE_1-------------------------------------------

위에는 내 서버를 웹소켓 설정을 하는 것이고
아래는 SEER에서 웹소켓 설정을 하기위한 포트번호이다.

내가 만든 웹페이지와 내 서버를 웹소켓 통신하려면 CASE_1을 사용,
다른 페이지와 웹소켓 하기 위해서는 CASE_2번을(각 페이지마다 포트번호는 당연히 틀리고)

CASE_2-------------------------------------------
let host_seer = "ws://192.168.0.20:8089/robotsStatus";
const wss_seer = new WebSocket(host_seer);

wss_seer.on('open',(ws)=>{
    console.log("SEER SUCCESS!!");
});

wss_seer.on("message",(data)=>{
    console.log("웹소켓으로 받은 데이터: "+ data);
})
CASE_2-------------------------------------------
*/








