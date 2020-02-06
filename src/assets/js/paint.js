import { getSocket } from "./sockets";

const canvas = document.querySelector(".canvas"),
  colorControls = document.querySelector(".controls__colors"),
  btnControls = document.querySelector(".controls_clean"),
  color = document.querySelector(".control__color"),
  wordContainer = document.querySelector(".answer"),
  clean = document.querySelector(".control__clean"),
  mode = document.querySelector(".control__mode");
const colors = document.querySelectorAll(".control__color");
const ctx = canvas.getContext("2d");
const WIDTH = 630,
  HEIGHT = 400;
canvas.width = WIDTH; //canvas 넓이
canvas.height = HEIGHT; //canvas 높이
let currentColor = "#000000"; //현재 사용 색

ctx.strokeStyle = currentColor; //line 색 설정
ctx.fillStyle = "#ffffff"; //fill 색 설정
ctx.lineWidth = 2.0; //라인 넓이 설정
ctx.fillRect(0, 0, WIDTH, HEIGHT);

let painting = false; //상태 체크
let filling = false;
const setColor = e => {
  const { events } = window;
  currentColor = e.target.style.backgroundColor;
  ctx.strokeStyle = currentColor;
};
function canvasX(x) {
  let bound = canvas.getBoundingClientRect();
  let bw = 5;
  return (x - bound.left - bw) * (canvas.width / (bound.width - bw * 2));
}
function canvasY(y) {
  let bound = canvas.getBoundingClientRect();
  let bw = 5;
  return (y - bound.top - bw) * (canvas.height / (bound.height - bw * 2));
}
const beginPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
};
const strokePath = (x, y) => {
  ctx.lineTo(x, y);
  ctx.stroke();
  //console.log(x, y);
};
const handleMove = e => {
  e.preventDefault();
  const { clientX, clientY } = e;
  const x = canvasX(clientX) || canvasX(e.touches[0].pageX); //canvas.getBoundingClientRect().left)//e.touches[0].target.offsetLeft);
  const y = canvasY(clientY) || canvasY(e.touches[0].pageY); //canvas.getBoundingClientRect().top)//e.touches[0].target.offsetTop);

  const { events } = window;
  if (!painting) {
    beginPath(x, y);
    getSocket().emit(events.beginPath, { x, y });
  } else {
    strokePath(x, y);
    getSocket().emit(events.strokePath, { x, y, color: currentColor });
  }
};
const handleDown = e => {
  //startPainting
  painting = true;
};
const handleUp = e => {
  //stopPainting
  painting = false;
};
const clearCanvas = () => {
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
};
const handleClean = e => {
  const { events } = window;
  clearCanvas();
  getSocket().emit(events.clean);
};
const handleCM = e => {
  event.preventDefault();
};
const handleCanvasClick = e => {
  const { events } = window;
  if (filling) {
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    getSocket().emit(events.setFill, { color: ctx.fillStyle });
  }
};
const handleModeClick = () => {
  if (!filling) {
    filling = true;
    painting = false;
    mode.innerText = "Paint";
    ctx.fillStyle = currentColor;
  } else {
    filling = false;
    painting = true;
    mode.innerText = "Fill";
    ctx.strokeStyle = currentColor;
  }
};
export const enableCanvas = () => {
  ctx.fillStyle = "#ffffff"; //fill 색 설정
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  canvas.addEventListener("mousemove", handleMove);
  //canvas.addEventListener("touch");
  canvas.addEventListener("mousedown", handleDown);
  canvas.addEventListener("mouseup", handleUp);
  canvas.addEventListener("mouseleave", handleUp);
  canvas.addEventListener("contextmenu", handleCM);
  canvas.addEventListener("click", handleCanvasClick);
};
export const disableCanvas = () => {
  canvas.removeEventListener("mousemove", handleMove);
  canvas.removeEventListener("mousedown", handleDown);
  canvas.removeEventListener("mouseup", handleUp);
  canvas.removeEventListener("mouseleave", handleUp);
  canvas.removeEventListener("contextmenu", handleCM);
  canvas.removeEventListener("click", handleCanvasClick);
};
export const handleCleaned = () => {
  clearCanvas();
};

export const hideControls = () => {
  colorControls.style.display = "none";
  btnControls.style.display = "none";
};
export const showControls = () => {
  colorControls.style.display = "flex";
  btnControls.style.display = "block";
};
export const showWord = word => {
  wordContainer.innerText = "";
  wordContainer.innerText = word;
};
if (canvas) {
  //enableCanvas();
  disableCanvas();
  hideControls();
  if (colors) {
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener("click", setColor);
    }
  }
  if (clean) clean.addEventListener("click", handleClean);
  if (mode) mode.addEventListener("click", handleModeClick);
}
export const handleBeganPath = ({ x, y }) => {
  //console.log(x, y);
  beginPath(x, y);
};
export const handleStrokedPath = ({ x, y, color = null }) => {
  const current = ctx.strokeStyle;
  if (color !== null) {
    ctx.strokeStyle = color;
  }
  strokePath(x, y);
  ctx.strokeStyle = current;
  //console.log(x, y);
};
export const handleFill = ({ color = null }) => {
  const cur = ctx.fillStyle;
  if (color !== null) {
    ctx.fillStyle = color;
  }
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = cur;
};
