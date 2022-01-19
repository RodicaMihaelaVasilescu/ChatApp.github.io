// This is the front end js file

const userList = document.getElementById("users");
const chatMessages = document.querySelector(".chat-messages");
const meetingId = document.getElementById("meeting_id");
const chatOverview = document.getElementById("chat_overview");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//We now have access to the front end socket here
const socket = io();

//send the room name and user name to the server
socket.emit("joinRoom", { username, room });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputMeetingId(room);
  outputUsers(users);
});

//Submit the form
chatOverview.addEventListener("submit", (e) => {
  e.preventDefault();

  //gettting the message
  const msg = e.target.elements.msg.value;

  //Emit message to the server
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output room name to DOM
function outputMeetingId(room) {
  meetingId.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}

// Catch the message here
socket.on("message", (message) => {
  console.log(message);

  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username}<span>${message.time}</span></p>
      <p class="text">
          ${message.textMessage}
      </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}
