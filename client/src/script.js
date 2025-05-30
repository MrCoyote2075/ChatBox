const socket = io();

socket.on("connect", () => {
    console.log("Socket.io is Running Perfectly...");
});

const chatBox = document.getElementById("chatBox");

window.onload = () => {
    document.getElementById("username").focus();
};

document.getElementById("join-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let username = document.getElementById("username");
    if (username.value) {
        socket.emit("user-entry", username.value);
        document.getElementById("join-container").classList.remove("active");
        document.getElementById("chat-container").classList.add("active");
    } else alert("can't be Empty");
});

socket.on("User-Update", (reason, username) => {
    if (username) {
        let newDiv = document.createElement("div");
        newDiv.classList.add("new-entry");
        newDiv.textContent = reason
            ? `${username} Joined The Group Chat...`
            : `${username} Left The Group Chat...`;
        chatBox.appendChild(newDiv);
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: "smooth",
        });
    }
});

socket.on("receive-message", (username, message) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("message", "other-message");
    newDiv.innerHTML = `
        <div class="display-name">${username}</div>
        <div class="msg">${message}</div>
    `;
    chatBox.appendChild(newDiv);
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth",
    });
});

document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("message");
    let msg = message.value;
    if (msg.length == 0) return;
    message.value = "";
    let newDiv = document.createElement("div");
    newDiv.classList.add("message", "my-message");
    newDiv.innerHTML = `
        <div class="display-name">You</div>
        <div class="msg">${msg}</div>
    `;
    chatBox.appendChild(newDiv);
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth",
    });
    socket.emit("send-message", msg);
});
