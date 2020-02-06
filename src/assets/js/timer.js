import { getSocket } from "./sockets";

const timer = document.querySelector(".time");

export const handleTimer = ({ remain }) => {
  const { events } = window;
  const time = `0:${remain < 10 ? `0${remain}` : remain}`;
  timer.innerHTML = time;
  if (remain === 0) {
    getSocket().emit(events.timeOut);
  }
};
