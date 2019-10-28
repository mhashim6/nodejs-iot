const HOST = "wss://iot-chat-mhashim6.herokuapp.com/";
ws = new WebSocket(HOST);

let username;
let nameInput = document.getElementById('name_input');
let loginBtn = document.getElementById('login');
loginBtn.onclick = login;

function login() {
    username = nameInput.value;
    ws.send(JSON.stringify({
        msgType: 'auth',
        userType: 'user',
        name: username
    }));

    document.getElementById('login_panel').className = 'hidden';
    document.getElementById('main_panel').classList.remove('hidden')
}

let msgBox = document.getElementById('chat_input');
let sendBtn = document.getElementById('chat_send');
let chatBox = document.getElementById('chat_box');
sendBtn.onclick = () => {
    ws.send(JSON.stringify({
        msgType: 'chat',
        sender: username,
        chatMsg: msgBox.value
    }));
    msgBox.value = '';
};
let leds = [led1, led2, led3];
let btns = [led1_btn, led2_btn, led3_btn];
btns.forEach((btn, i) => btn.onclick = () => {
    ws.send(JSON.stringify({
        msgType: 'control',
        led: i
    }));
});

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);

    switch (data.msgType) {
        case "chat":
            chatBox.innerHTML += newMsg(data.sender, data.chatMsg);
            break;
        case "control":
            leds[data.led].className = leds[data.led].className === 'on'? 'off' : 'on';
            break;
    }

};

ws.onopen = () => {

};

const newMsg = (name, msg) =>
    `<div class="${name === username ? 'homeMsg' : 'outsiderMsg'} msg">${name !== username ? `<p class="userName">${name}</p>` : ''}${msg}</div>`;
