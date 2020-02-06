import "@babel/polyfill";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import socketIO from "socket.io";
import socketEvent from "./socket";
import path from "path";
import events from "./events";

import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(helmet());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.render("home", { events: JSON.stringify(events) });
});
const handleListener = () => {
  console.log(`Express is running on post:${process.env.PORT}`);
};
const server = app.listen(process.env.PORT, handleListener);
const io = socketIO.listen(server); //server와 socket 연결, io가 모든 이벤트를 알아야되기 때문에 io 변수 선언
socketEvent(io); //
