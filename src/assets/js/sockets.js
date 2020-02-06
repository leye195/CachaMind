import { handleNewUser, handleDisconnect } from "./notification";
import { handleNewMessage } from "./chat";
import {
  handleStrokedPath,
  handleCleaned,
  handleBeganPath,
  handleFill
} from "./paint";
import {
  handleUpdate,
  handleStarted,
  handleTurn,
  handleEnded
} from "./players";
import { handleTimer } from "./timer";
let socket = null;
export const getSocket = () => socket;
export const updateSocket = asocket => (socket = asocket);
export const initSockets = asocket => {
  const { events } = window;
  updateSocket(asocket);
  asocket.on(events.newUser, handleNewUser);
  asocket.on(events.disconnected, handleDisconnect);
  asocket.on(events.newMsg, handleNewMessage);
  asocket.on(events.beganPath, handleBeganPath);
  asocket.on(events.strokedPath, handleStrokedPath);
  asocket.on(events.setFill, handleFill);
  asocket.on(events.cleaned, handleCleaned);
  asocket.on(events.playerUpdate, handleUpdate);
  asocket.on(events.gameStarted, handleStarted);
  asocket.on(events.painterNotification, handleTurn);
  asocket.on(events.gameEnded, handleEnded);
  asocket.on(events.timeUpdate, handleTimer);
};
