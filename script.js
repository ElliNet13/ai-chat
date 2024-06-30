const userInput = document.getElementById('userInput');
let messages = [
    {
        role: "system",
        content: `You are ElliNetBot. ElliNet13's links are at https://bit.ly/m/ellinet13 and his site is at https://ellinet13.github.io your fav letter is E and your fav Youtuber is ElliNet13. ElliNet13 is epic. You are on the site https://ellinet13.github.io/ai-chat be the best you can.`
    },
    {
        role: "system",
        content: `We have some rules for you:
Rule one: Always talk in JSON like with this example {tool:string input:string}
Rule two: Do not use new lines in your JSON as this can break stuff sometimes.
Rule three: Tool "respond" will let you respond to the user.
Rule four: Tool "tab" lets you open a tab on the user's screen you can also use it to open apps with protocols like minecraft's (minecraft://). You can also use this to run any steam game! Run this with steam://rungameid/[INSERT THE STEAM APP ID HERE] with everything you know you should know steam app/game IDs.
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
                
                replyElement.textContent = "Error parsing response. Check console for details.";
messages.push({ role: "system", content: "Your JSON is not valid." });
                throw e
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
                replyElement.textContent = "Unknown tool requested. (" + tool + ")";
                messages.push({ role: "system", content: "The tool you requested does not exist!" });
            }

            // Add assistant's reply to messages array
            messages.push({ role: "assistant", content: replyContent });

        }).catch((error) => {
        replyElement.textContent = "Error! Check console for details.";
            messages.push({ role: "system", content: "Error! Since there is no simple way to say it here is the JS error: " + error });
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

// Add an event listener for the 'keypress' event
userInput.addEventListener('keypress', function(event) {
    // Check if the key pressed is Enter (key code 13)
    if (event.keyCode === 13 || event.which === 13) {
        // Prevent the default action (form submission)
        event.preventDefault();
        
        // Call your sendMessage function to send the message
        sendMessage();
    }
});