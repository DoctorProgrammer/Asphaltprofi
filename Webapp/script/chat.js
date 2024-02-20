let currentChat;
let chatList;
let user;

async function onStart() {
    currentChat = null;
    chatList = [];
    user = await getUser();
    user = user[0];
    loadChats();
}

document.addEventListener('DOMContentLoaded', function() {
    const LOADER = document.getElementById('loader');
    LOADER.classList.remove('hidden');
    onStart();
});

async function getUser() {
    // fetch user: http://localhost:3000/verify/${localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/token/${localStorage.getItem('token')}`);
    const data = await response.json();
    return data;
}

function scrollToBottom() {
    const messageList = document.querySelector('.message:last-child');
    messageList.scrollIntoView();
}

async function loadChats() {
    // fetch chats: http://localhost:3000/user/1000000000/chats
    const response = await fetch(`http://localhost:3000/user/${user.ID}/chats`);
    const data = await response.json();
    
    chatList.push(...data);
    console.log(chatList);
    showChats();
    
    const LOADER = document.getElementById('loader');
    LOADER.classList.add('hidden');
}

async function openChat(chatID) {
    currentChat = chatID;
    // fetch messages: http://localhost:3000/chat/${chatID}/messages
    const response = await fetch(`http://localhost:3000/chat/${chatID}/messages`);
    const data = await response.json();
    showMessages(data);
}

async function sendMessage() {
    
}

async function createChat() {
    
}

function showChats() {
    /* 
        HTML for one chat:
        <li class="chat" onclick="openChat(chatID)">
            <img src="./databaseImages/" alt="profilepicture">
            <div>
                <h2>Max Mustermann</h2>
                <p>Hi, wie gehts?</p>
            </div>
        </li>
    */
    const chatListElement = document.getElementById('chatlist');
    chatListElement.innerHTML = '';
    chatList.forEach((chat) => {
        console.log(chat);
        let userID;
        let friendID;
        if (chat.userID === user.ID) {
            userID = chat.userID;
            friendID = chat.user2ID;
        } else {
            userID = chat.user2ID;
            friendID = chat.userID;
        }
        const chatElement = document.createElement('li');
        chatElement.classList.add('chat');
        chatElement.onclick = () => openChat(chat.ID);
        const img = document.createElement('img');
        img.src = `./databaseImages/${chat.ID}.png`;
        img.alt = 'profilepicture';
        const div = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.innerText = chat.name;
        const p = document.createElement('p');
        // chat.lastMessage.text might be undefined. Check if it exists before accessing it.
        if (chat.lastMessage && chat.lastMessage.text) {
            if (chat.lastMessage.text.length > 22) {
                p.innerText = chat.lastMessage.text.substring(0, 21) + '...';
            } else {
                p.innerText = chat.lastMessage.text;
            }
        } else {
            p.innerText = '';
        }
        div.appendChild(h2);
        div.appendChild(p);
        chatElement.appendChild(img);
        chatElement.appendChild(div);
        chatListElement.appendChild(chatElement);
    });
}

function addChat() {
    const CHATDIALOG = document.getElementById("addChatDialog");
    const CHATDIALOGCANCEL = document.getElementById("cancleDialog");
    const CHATDIALOGSUBMIT = document.getElementById("submitModal");

    CHATDIALOG.showModal();

    CHATDIALOGCANCEL.addEventListener('click', function() {
        CHATDIALOG.close();
    });
}