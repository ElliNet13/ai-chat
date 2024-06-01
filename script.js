let messages = [];

function sendMessage() {
    var userInput = document.getElementById('userInput');
    var message = userInput.value.trim();
    var messagesContainer = document.getElementById('messages');

    if (message !== "") {
        // Create user message element
        var userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message');
        userMessageElement.textContent = "You: " + message;
        messagesContainer.appendChild(userMessageElement);

        // Add user message to messages array
        messages.push({ role: "user", content: message });

        // Create reply message element
        var replyElement = document.createElement('div');
        replyElement.classList.add('message');
        replyElement.textContent = "Generating...";
        messagesContainer.appendChild(replyElement);

        userInput.value = "";

        // Send messages to the chat API
        puter.ai.chat(messages).then((response) => {
            // Extract the assistant's reply content
            let replyContent = response.message.content;

            // Add assistant's reply to messages array
            messages.push({ role: "assistant", content: replyContent });
            replyElement.textContent = "AI: " + replyContent;
        }).catch((error) => {
            console.error("Detailed Error:", error);
            replyElement.textContent = "Error! Check console for details.";
        });

        // Scroll to bottom of messages
        messagesContainer.scrollTop = messagesContainer.scrollHeight + replyElement.offsetHeight + 12;
    }
}

function changeTheme(themeName) {
    document.getElementById('theme').href = themeName;
}