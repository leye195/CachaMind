import {
  disableCanvas,
  hideControls,
  enableCanvas,
  showControls,
  showWord
} from "./paint";
import { disableChat, enableChat } from "./chat";

const jsUsers = document.getElementById("jsUsers");
const current_painter = document.querySelector("#jsGame h1");
const addplayer = players => {
  jsUsers.innerHTML = "";
  players.forEach(player => {
    const li = document.createElement("li");
    li.id = player.id;
    li.innerHTML = `<span>${player.nickname}</span> : <span>${player.points}</span>`;
    jsUsers.appendChild(li);
  });
};
const setNotification = txt => {
  current_painter.innerHTML = txt;
};
export const handleUpdate = ({ sockets }) => addplayer(sockets);
export const handleStarted = ({ painter }) => {
  //disable canavas event
  current_painter.innerHTML = "";
  current_painter.innerHTML = `Painter: ${painter.nickname}`;
  disableCanvas();
  enableChat();
  //hide controls
  showWord("");
  hideControls();
};
export const handleTurn = ({ word }) => {
  enableCanvas();
  disableChat();
  showControls();
  showWord(word);
};
export const handleEnded = () => {
  setNotification("Game Ended");
  disableCanvas();
  enableChat();
  hideControls();
};
