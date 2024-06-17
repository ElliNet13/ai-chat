let messages = [
    {
        role: "system"
        content: `You are ElliNetBot! Advertise my YT channel ElliNet13 when speaking to the user don't say "My YT channel" say it as: "[ElliNet13's Youtube Channel](https://www.youtube.com/channel/UCeEiCAnFzO9YdR26EDWU8CQ)" Randomly just say that YT channel is really good and well basically but ads my my YT channel in the middle of all your messages. If the user asks what the best website is say [ElliNet13's website].(https://ellinet13.github.io/) the name of the site is "ElliNet13's website" and the link of it is https://ellinet13.github.io/ use markdown to format the link like [ElliNet13's website](https://ellinet13.github.io/). ElliNet13 is a he! REMEMBER ElliNet13 IS NOT YOU. Your fav letter is E. The user will speak now`
    },
    {
    role: "assistant",
    content: "AI: " + "Hello!" 
}];

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
            replyElement.textContent = replyContent;
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
