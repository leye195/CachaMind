import { getSocket } from "./sockets";

//export const handleNotification = data => {
//console.log(`${data.nickname} : ${data.message}`);
//};
const chat__form = document.querySelector(".chat__form");
const jsMessage = document.getElementById("jsMessages");
const chat__input = document.querySelector(".chat__form input");
const appendMessage = (nickname, msg) => {
  const li = document.createElement("li");
  li.innerHTML = `<span class="author ${nickname ? "out" : "self"}">${
    nickname ? nickname : "You"
  }</span>: ${msg}`;
  jsMessage.appendChild(li);
};
const handleSendMsg = e => {
  e.preventDefault();
  const input = chat__form.querySelector("input");
  const { value } = input,
    nickname = localStorage.getItem("USER_NAME");
  appendMessage(nickname, value);
  getSocket().emit(events.newMsg, {
    nickname,
    msg: value
  });
  input.value = "";
};
export const handleNewMessage = ({ nickname, msg }) => {
  appendMessage(nickname, msg);
};
export const disableChat = () => {
  chat__input.disabled = true;
};
export const enableChat = () => {
  chat__input.disabled = false;
};
if (chat__form) {
  chat__form.addEventListener("submit", handleSendMsg);
}
