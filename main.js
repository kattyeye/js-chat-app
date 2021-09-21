const duckieName = {
    name: "Debbie",
}

function grabMessages() {
fetch("https://tiny-taco-server.herokuapp.com/debbie-chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(duckieName),
    })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Oops, something went wrong!", response.status);
    }
    return response.json();
  })

  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error))
}
