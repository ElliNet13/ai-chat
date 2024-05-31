let messages = []

function sendMessage() {
            var userInput = document.getElementById('userInput');
            var message = userInput.value.trim();
    messages.push({ role: "user", content: message });
            var messagesContainer = document.getElementById('messages');

            if (message !== "") {
                // Create user message element
                var userMessageElement = document.createElement('div');
                userMessageElement.classList.add('message');
                userMessageElement.textContent = message;
                messagesContainer.appendChild(userMessageElement);

            

                

                // Create reply message element
                var replyElement = document.createElement('div');
                replyElement.classList.add('message');
                replyElement.textContent = "Generateing...";
                messagesContainer.appendChild(replyElement);

                userInput.value = ""
                puter.ai.chat(message).then((response) => {
                    messages.push({ role: "assistant", content: response });
                    replyElement.textContent = response;
                });

                // Scroll to bottom of messages
                messagesContainer.scrollTop = messagesContainer.scrollHeight + replyElement.offsetHeight + 12;
            }
}

function changeTheme(themeName) {
    document.getElementById('theme').href = themeName;
}