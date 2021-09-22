(function () {
    'use strict';

    let user = localStorage.getItem('user');
    const messageList = document.querySelector('#message-list');
    const chatForm = document.querySelector('#chat-form');

    if (!user) {
        user = prompt("Please enter your name to continue.");
        localStorage.setItem('user', user);
    }

    function generateHTML(message) {
        const html = `
        <li>
            <p><strong>${message.sender}: </strong>${message.message}</p>
            <button data-id="${message.id}">Delete</button>
        </li>
        `
        return html;
    }

    function fetchMessages() {
         fetch("https://tiny-taco-server.herokuapp.com/debbie-chat/")
            .then(response => response.json())
            .then(function (messages) {
                let html = "";
                for (let i = 0; i < messages.length; i++) {
                    html += generateHTML(messages[i]);
                }
                console.log('html', html)
                messageList.innerHTML = html;
            });
    }

    fetchMessages();
    setInterval(fetchMessages, 3000);

    function deleteMessage(event) {
        const id = event.target.dataset.id;

        fetch(`https://tiny-taco-server.herokuapp.com/debbie-chat/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Oops, something went wrong!", response.status);
                }
                event.target.parentNode.remove();
            });
    }

    messageList.addEventListener('click', deleteMessage);

    function addMessage(event) {
        event.preventDefault();
        const message = {
            sender: user,
            message: event.target.message.value,
        }

        fetch("https://tiny-taco-server.herokuapp.com/debbie-chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Oops, something went wrong!", response.status);
                }
                return response.json();
            })
            .then(data => {
                const html = generateHTML(data);
                messageList.insertAdjacentHTML('beforeend', html);
                event.target.reset();
            });
    }

    chatForm.addEventListener('submit', addMessage);

})();
