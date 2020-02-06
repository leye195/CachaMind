const notifications = document.getElementById("jsNotification");
const fireNotification = (text, color) => {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = text;
  notification.style.backgroundColor = color;
  notifications.appendChild(notification);
};
export const handleNewUser = ({ nickname, users }) => {
  fireNotification(`${nickname} just joined`, "rgb(0,122,255)");
  console.log(`${nickname} just joined`);
  //console.log(users);
};
export const handleDisconnect = ({ nickname }) => {
  fireNotification(`${nickname} just left`, "rgb(222,0,10)");
  console.log(`${nickname} just left`);
};
