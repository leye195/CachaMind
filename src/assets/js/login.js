import { initSockets } from "./sockets";

const LOGGED_OUT = "loggedOut",
  LOGGED_IN = "loggedIn",
  NICK_NAME = "USER_NAME";
const body = document.querySelector("body");
const loginForm = document.querySelector(".loginBox form");
const quit = document.querySelector(".quit");
const init = () => {
  const nickname = localStorage.getItem(NICK_NAME);
  if (nickname === null) {
    body.className = LOGGED_OUT;
  } else {
    body.className = LOGGED_IN;
    logIn(nickname);
  }
};
const logIn = nickname => {
  const socket = io("/");
  const { events } = window;
  localStorage.setItem(NICK_NAME, nickname);
  socket.emit(events.setNickname, { nickname });
  body.className = LOGGED_IN;
  quit.style.display = "block";
  initSockets(socket);
};

const handleSubmit = e => {
  e.preventDefault();
  const input = loginForm.querySelector("input");
  const val = input.value;
  //console.log(val);
  logIn(val);
};
const handleQuit = e => {
  body.className = LOGGED_OUT;
  quit.style.display = "none";
};
if (loginForm) {
  init();
  loginForm.addEventListener("submit", handleSubmit);
  quit.addEventListener("click", handleQuit);
}
