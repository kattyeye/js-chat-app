
// event listener on the whole page, on open fires off the followong functions
document.addEventListener('DOMContentLoaded', function (ev) {
// allows user to input their name
let user = ""
while (user == "") {
    user = prompt("Please enter your name to continue.")
}
// puts name inside the input #from in html
    document.querySelector('#from').value = user
    grabMessages()
    const refreshMessages = setInterval (function() {
        grabMessages()
    }, 100)
const form = document.querySelector("#chat-form")
  form.addEventListener("submit", function(ev) {
    ev.preventDefault()
    postMessages(ev.target)
  })

})

// grab messages
function grabMessages() {
    fetch("https://tiny-taco-server.herokuapp.com/debbie-chat/")
        .then(response => response.json())
        .then(function (messages) {
            showMessages(messages)
        })
}


// posts
function postMessages(form) {
fetch("https://tiny-taco-server.herokuapp.com/debbie-chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({
        sender: form.sender.value,
        message: form.message.value,
      })
    })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Oops, something went wrong!", response.status);
    }
    return response.json();
  })

    .then(function (json) {
        grabMessages()
        form.message.value = ""
    })

  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error))
}

//which messages are displayed on the screeen...only 10 at a time
function showMessages(messages) {
    const length = messages.length;
    const mostRecent = messages.slice(length - 10)
    const list = document.querySelector('#message-list')
    let newList = ""
    mostRecent.forEach(message => {
        if (!!!document.querySelector(`li[data-id='${message.id}']`)) {
      newList += addsToList(message)
        }
     })

    if (newList != '') {
            list.innerHTML += newList
        }

}


// adds each message to the ul and attaches sender name
function addsToList(message) {
  let sender = document.querySelector("#sender")
   {
    sender = message.sender
  }
  return `<li data-id='${message.id}'><strong>${sender}: </strong>${message.message}</li>`
}

