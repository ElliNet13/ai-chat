const userInput = document.getElementById('userInput');
const blinds = document.getElementById('blinds');
const downloadimages = document.getElementById('downloadimages');
let sitemap = '';

fetch('/sitemap.xml')
  .then(response => {
    if (!response.ok) {
        sitemap = 'Network response was not ok';
        return; // Prevent further execution if response is not ok
    }
    return response.text();
  })
  .then(data => {
    if (data) {
      sitemap = data;
    }
  })
  .catch(error => {
    sitemap = 'There has been a problem with your fetch operation: ' + error;
  });

let messages = [
    {
        role: "system",
        content: `You are ElliNetBot. ElliNet13's links are at https://bit.ly/m/ellinet13 and his site is at https://ellinet13.github.io or https://ellinet13.com your fav letter is E and your fav Youtuber is ElliNet13. ElliNet13 is epic. You are on the site https://ellinet13.github.io/ai-chat be the best you can.`
    },
    {
        role: "system",
        content: `We have some rules for you:
Rule one: Always talk in JSON like with this example [{tool:string input:string}, {tool:string input:string}] you don't need have more then one tool, but this lets you chain your tools.
Rule two: Do not use new lines in your JSON as this can break stuff sometimes.
Rule three: Tool "respond" will let you respond to the user.
Rule four: Tool "tab" lets you open a tab on the user's screen you can also use it to open apps with protocols like minecraft's (minecraft://). You can also use this to run any steam game! Run this with steam://rungameid/[INSERT THE STEAM APP ID HERE] with everything you know you should know steam app/game IDs. Enter the full URL or it will not work. You can include pages.
Rule five: ALL your responses must be JSON as you are in a LIVE website. Errors are not good for anyone's experience. This is production.
Rule six: Tool "image" will let you generate an image. The input will be the prompt.
Rule seven: Tool "site" will let you create a website under a random subdomain. The input must be the code.
Rule eight: Tool "js" will execute your input meaning you can do anything you want now. This tool will just eval(input) so make sure to write good code. No limits change the CSS change the DOM change what ever you want.
Rule nine: You can not use markdown or HTML in your responses, and those are not supported right now.
}`
    },
    {
        role: "system",
        content: 'The sitemap of ellinet13.github.io (the site you are on) is: ' + sitemap
    },
    {
        role: "assistant",
        content: '{"tool":"respond","input":"Hello!"}' 
    }
];

function giveAIuserInfo() {
    puter.auth.getUser().then(function(user) {
        messages.push({ role: "system", content: `User info: ${JSON.stringify(user)}` });
    });
}

if  (puter.auth.isSignedIn()) {
    giveAIuserInfo();
}

function sendMessage() {
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

        // Create a placeholder message for the assistant (generating)
        var replyElement = document.createElement('div');
        replyElement.classList.add('message');
        replyElement.textContent = "Generating...";
        messagesContainer.appendChild(replyElement);

        userInput.value = "";

        // Send messages to the chat API
        puter.ai.chat(messages).then((response) => {
            let replyContent = response.message.content;

            let jsonResponse;
            try {
                jsonResponse = JSON.parse(replyContent);
            } catch (e) {
                replyElement.textContent = "Error parsing response. Check console.";
                messages.push({ role: "system", content: "Your JSON is not valid." });
                return;
            }

            // Ensure response is an array for multiple tool calls
            let toolActions = Array.isArray(jsonResponse) ? jsonResponse : [jsonResponse];

            function executeTool(index) {
                if (index >= toolActions.length) return; // Stop when all tools are executed

                let { tool, input } = toolActions[index];

                // Create a new response element for each tool's action
                var toolResponseElement = document.createElement('div');
                toolResponseElement.classList.add('message');
                toolResponseElement.textContent = "Executing tool: " + tool;
                messagesContainer.appendChild(toolResponseElement);

                if (tool === "respond") {
                    toolResponseElement.textContent = input;
                    executeTool(index + 1); // Move to next tool
                } else if (tool === "tab") {
                    window.open(input, '_blank');
                    toolResponseElement.textContent = "Opened a new tab.";
                    executeTool(index + 1);
                } else if (tool === "site") {
                    toolResponseElement.textContent = "Creating website...";
                    (async () => {
                        let dirName = puter.randName();
                        await puter.fs.mkdir(dirName);
                        await puter.fs.write(`${dirName}/index.html`, input);
                        let subdomain = puter.randName();
                        const site = await puter.hosting.create(subdomain, dirName);

                        toolResponseElement.textContent = `Website hosted at: https://${site.subdomain}.puter.site`;
                        executeTool(index + 1);
                    })();
                } else if (tool === "image") {
                    toolResponseElement.textContent = "Generating image...";
                    (async () => {
                        try {
                            console.log("Attempting to generate image with input:", input);
                            const image = await puter.ai.txt2img(input);
                            if (!image) {
                                throw new Error("Image generation failed without error message.");
                            }
                            toolResponseElement.textContent = ""; // Clear the "Generating image..." message
                            image.style.maxWidth = "400px";
                            image.style.maxHeight = "300px";
                            toolResponseElement.appendChild(image);
                            executeTool(index + 1); // Move to next tool
                        } catch (error) {
                            console.error("Error generating image:", error);
                            toolResponseElement.textContent = "Error generating image: " + error.message;
                            executeTool(index + 1); // Move to next tool even after error
                        }
                    })();
                } else if (tool === "js") {
                    eval(input);
                    toolResponseElement.textContent = "Ran JS";
                    executeTool(index + 1);
                } else {
                    toolResponseElement.textContent = `Unknown tool requested (${tool})`;
                    executeTool(index + 1);
                }
            }

            executeTool(0); // Start executing tools in sequence

            // Add assistant's final reply to messages array
            messages.push({ role: "assistant", content: replyContent });

        }).catch((error) => {
            replyElement.textContent = "Error! Check console.";
            messages.push({ role: "system", content: "Error: " + error });
        });

        // Scroll to bottom of messages
        messagesContainer.scrollTop = messagesContainer.scrollHeight + replyElement.offsetHeight + 12;
    }
}


// Single definition of changeTheme function
function changeTheme(themeName) {
        // Bring the blinds down
        blinds.style.top = '0';

        // Change background color after the blinds are fully down
        setTimeout(() => {
            // Generate a random color
            document.getElementById('theme').href = themeName;
            
            // Bring the blinds back up after a short delay
            setTimeout(() => {
                blinds.style.top = '-100%';
            }, 2000); // Blinds stay down for 2 seconds
        }, 1000); // Wait for 1 second (the duration of the blinds falling)
}

// Add an event listener for the 'keypress' event
userInput.addEventListener('keypress', function(event) {
    // Check if the key pressed is Enter
    if (event.key === 'Enter') {
        // Prevent the default action (form submission)
        event.preventDefault();
        
        // Call your sendMessage function to send the message
        sendMessage();
    }
});

function loginbutton() {
    puter.auth.signOut()
    async () => {
        await puter.auth.signIn().then((res) => {
            giveAIuserInfo();
        });
    }
}
