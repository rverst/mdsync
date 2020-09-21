'use strict';

const saveScroll = () => {
    let x = (window.pageXOffset || document.body.scrollLeft);
    let y = (window.pageYOffset || document.body.scrollTop) ;
    window.sessionStorage.setItem('scrollX', x.toString());
    window.sessionStorage.setItem('scrollY', y.toString());
}

const loadScroll = () => {
    let x, y = 0;
    if (window.sessionStorage.getItem('scrollX')) {
        x = parseFloat(window.sessionStorage.getItem('scrollX'));
    }
    if (window.sessionStorage.getItem('scrollY')) {
        y = parseFloat(window.sessionStorage.getItem('scrollY'));
    }
    window.scrollTo(x, y);
}

const socketMessageListener = (event) => {
    console.log('ws data', event.data);
    let data = JSON.parse(event.data);
    if (data.message === "reload") {
        location.reload();
    }
};

const socketOpenListener = () => {
    console.log('ws connected', socket.url);
};

const socketCloseListener = () => {
    if (socket) {
        console.log('ws disconnected');
    }
    let url = window.origin.replace('http', 'ws') + '/ws';
    console.log(url);
    socket = new WebSocket(url);
    socket.addEventListener('open', socketOpenListener);
    socket.addEventListener('message', socketMessageListener);
    socket.addEventListener('close', socketCloseListener);
};

let socket;
document.addEventListener("DOMContentLoaded", loadScroll);
window.addEventListener("beforeunload", saveScroll);
socketCloseListener();
