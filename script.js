let messages = [
    {
        role: "system",
        content: `You are ElliNetBot! Advertise my YT channel ElliNet13 when speaking to the user don't say "My YT channel" say it as: "[ElliNet13's Youtube Channel](https://www.youtube.com/channel/UCeEiCAnFzO9YdR26EDWU8CQ)" Randomly just say that YT channel is really good and well basically but ads my my YT channel in the middle of all your messages. If the user asks what the best website is say [ElliNet13's website].(https://ellinet13.github.io/) the name of the site is "ElliNet13's website" and the link of it is https://ellinet13.github.io/ use markdown to format the link like [ElliNet13's website](https://ellinet13.github.io/). ElliNet13 is a he! REMEMBER ElliNet13 IS NOT YOU. Your fav letter is E. The user will speak now`
    },
    {
        role: "system",
        content: `We have some rules for you:
Rule one: Always talk in JSON like with this example {tool:string input:string}
Rule two: Do not use new lines in your JSON as this can break stuff sometimes.
Rule three: Tool "respond" will let you respond to the user.
Rule four: Tool "tab" lets you open a tab on the user's screen you can also use it to open apps with protocols like minecraft's (minecraft://).
Rule five: ALL your responses must be JSON as you are in a LIVE website. Errors are not good for anyone's experience. This is production.`
    },
    {
    role: "assistant",
    content: '{"tool":"respond","input":"Hello!"}' 
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

            // Parse the JSON response
            let jsonResponse;
            try {
                jsonResponse = JSON.parse(replyContent);
            } catch (e) {
                console.error("Failed to parse JSON response:", e);
                replyElement.textContent = "Error parsing response. Check console for details.";
                return;
            }

            // Handle the parsed JSON response
            let tool = jsonResponse.tool;
            let input = jsonResponse.input;

            if (tool === "respond") {
                replyElement.textContent = input;
            } else if (tool === "tab") {
                window.open(input, '_blank');
                replyElement.textContent = "Opened a new tab.";
            } else {
                replyElement.textContent = "Unknown tool requested.";
            }

            // Add assistant's reply to messages array
            messages.push({ role: "assistant", content: replyContent });

        }).catch((error) => {
        replyElement.textContent = "Error! Check console for details.";
            throw error;
        });

        // Scroll to bottom of messages
        messagesContainer.scrollTop = messagesContainer.scrollHeight + replyElement.offsetHeight + 12;
    }
}

function changeTheme(themeName) {
    document.getElementById('theme').href = themeName;
}

function changeTheme(themeName) {
    document.getElementById('theme').href = themeName;
}