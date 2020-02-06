import events from "./events";
import { chooseWord } from "./words";
let sockets = [];
let inProgress = false;
let word = null;
let painter = null;
let timeout = null;
let remain = 30;
const limit = 2;
const choosePainter = () => sockets[Math.floor(Math.random() * sockets.length)];

export const socketController = (socket, io) => {
  //문제점은 서버를 재시작하면 socket의 메모리가 초기화됨,
  const broadcast = (event, data) => {
    socket.broadcast.emit(event, data);
  };
  const superBroadcast = (event, data) => {
    io.emit(event, data);
  };
  const startGame = () => {
    if (!inProgress) {
      inProgress = true;
      painter = choosePainter();
      word = chooseWord();
      superBroadcast(events.gameStarted, { painter });
      io.to(painter.id).emit(events.painterNotification, { word });
      timeout = setInterval(() => {
        remain -= 1;
        superBroadcast(events.timeUpdate, { remain });
      }, 1000);
    }
  }; //리더 지정  , 무작위 단위 지정
  const endGame = () => {
    inProgress = false;
    superBroadcast(events.gameEnded, {});
    superBroadcast(events.cleaned, {});
    if (timeout) {
      clearInterval(timeout);
      remain = 30;
      superBroadcast(events.timeUpdate, { remain });
    }
    if (sockets.length > 1) startGame();
  };
  const addPoint = socket => {
    /*for (let i = 0; i < sockets.length; i++) {
      if (sockets[i].nickname === socket.nickname) {
        sockets[i].points += 10;
      }
    }*/
    sockets = sockets.map(item => {
      if (item.id === socket.id) {
        item.points += 10;
      }
      return item;
    });
    superBroadcast(events.playerUpdate, { sockets });
    endGame();
  };
  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, nickname: socket.nickname, points: 0 }); //클라이언트 정보 저장
    broadcast(events.newUser, { nickname });
    superBroadcast(events.playerUpdate, { sockets }); //player 업데이트
    if (sockets.length === limit) startGame();
  });
  socket.on(events.notification, ({ nickname, msg }) => {
    //console.log(`${nickname}: ${msg}`);
  });
  socket.on(events.disconnect, () => {
    //console.log("disconnect");
    //users.splice(users.indexOf(socket.nickname), 1);
    sockets = sockets.filter(item => {
      return item.nickname !== socket.nickname;
    });
    if (sockets.length < limit || socket.id === painter.id) {
      endGame();
    }
    broadcast(events.disconnected, { nickname: socket.nickname });
    superBroadcast(events.playerUpdate, { sockets }); //player 업데이트
  });
  socket.on(events.newMsg, ({ nickname, msg }) => {
    broadcast(events.newMsg, { nickname, msg });
    if (msg === word && socket.nickname !== painter.nickname) {
      //메시지와 msg 비교
      console.log("Correct");
      superBroadcast(events.newMsg, {
        nickname: "Bot",
        msg: `The winner is ${nickname}, the answer was : ${word}`
      });
      addPoint(socket);
      //clearTimeout(timeout);
      //startGame();
    }
  });
  socket.on(events.beginPath, ({ x, y }) => {
    broadcast(events.beganPath, { x, y });
  });
  socket.on(events.strokePath, ({ x, y, color }) => {
    broadcast(events.strokedPath, { x, y, color });
  });
  socket.on(events.setFill, ({ color }) => {
    broadcast(events.setFill, { color });
  });
  socket.on(events.clean, () => {
    broadcast(events.cleaned, {});
  });
  socket.on(events.timeOut, () => {
    endGame();
  });
};
