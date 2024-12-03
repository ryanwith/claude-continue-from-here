// Edit this if you would like to provide a different autogenerated explanation of the messages:
const EXPLANATION = `I would like to continue from a conversation we've already had.  
Below you can see the messages I sent you and what you provided in response.
---------------------\n`
const FOLLOW_UP = `\n---------------------
I would like to continue the conversation with the following:\n\n`



// async function extractMessageContent(message) {
//     const contents = [];
    
//     // // Check for file attachments first
//     // const fileAttachments = message.querySelectorAll('[data-testid]');
//     // for (const file of fileAttachments) {
//     //   if (file.dataset.testid.endsWith('.sql') || file.dataset.testid.endsWith('.js') || file.dataset.testid.endsWith('.py')) {
//     //     console.log("file")
//     //     console.log(file)
//     //     contents.push({
//     //       type: 'file-reference',
//     //       title: file.dataset.testid,
//     //       elements: [{
//     //         code: file.textContent || ''
//     //       }]
//     //     });
//     //   }
//     // }

//     // Find the main grid container
//     const gridContainer = message.querySelector('.font-user-message') || message.querySelector('.grid-cols-1.grid.gap-2\\.5');

//     if (gridContainer) {
//       const elements = gridContainer.children;
      
//       for (const element of elements) {
//         const elementType = element.tagName.toLowerCase();
        
//         switch (elementType) {
//           case 'p':
//             contents.push({
//               type: 'p',
//               elements: [element.textContent]
//             });
//             break;
            
//           case 'pre':
//             const codeText = element.textContent
//               .split('\n')
//               .map(line => line.trim());
//             let firstLine = processCodeBlockFirstLine(codeText[0]);
//             codeText[0] = firstLine;
//             contents.push({
//               type: 'pre',
//               elements: codeText
//             });
//             break;
            
//           case 'ol':
//           case 'ul':
//             const listItems = Array.from(element.querySelectorAll('li'))
//               .map(li => li.textContent);
//             contents.push({
//               type: elementType,
//               elements: listItems
//             });
//             break;
            
//           case 'div':
//             console.log("HIT A DIV")
//             // Handle both user files and Claude code references
//             if (element.hasAttribute('data-testid')) {
//               try {
//                 const codeContent = await getCodeFromReference(element);
//                 if (codeContent) {
//                   contents.push(codeContent);
//                 }
//               } catch (error) {
//                 console.error('Error getting code reference:', error);
//               }
//             }
//             break;
//         }
//       }
//     }
  
//     return contents;
// }

// function extractUserProvidedFiles(element){
//   const fileContent = [];
//   const fileButtons = element.querySelectorAll('button[data-testid="file-thumbnail"]');
//   fileButtons.forEach((button) => {
//     title = button.closest('div[data-testid]').getAttribute('data-testid');
//     title = 
//   });

//   title 

//   const codeContent = {
//     type: 'code-reference',
//     title,
//     elements: [{
//       language: getCodeLanguage(codeBlock),
//       code: codeBlock.textContent
//         .split('\n')
//     }]
//   };


//   potentialFileContainers = element.querySelectorAll('button[data-testid="file-thumbnail"]');
//   actualFileContainers = Array.from(fileContainer).filter(div => 
//       div.querySelector('button[data-testid="file-thumbnail"]') !== null
//   );

  


// }

// function extractUserFileFromButton(button){
//   // expands the sidebar so we can see the file
//   title = button.closest('div[data-testid]').getAttribute('data-testid');

//   button.click();

//   const fileContent = {
//     type: 'file-reference',
//     title,
//     elements: [{
//       language: null,
//       text: codeBlock.textContent
//         .split('\n')
//     }]
//   };
// }

// function extractUserProvidedFiles(element){
//   const fileContent = [];
//   const fileButtons = element.querySelectorAll('button[data-testid="file-thumbnail"]');
//   fileButtons.forEach((button) => {
//     fileContent.push(extactUserFileFromButton(button))
//   });

//   title 




//   potentialFileContainers = element.querySelectorAll('button[data-testid="file-thumbnail"]');
//   actualFileContainers = Array.from(fileContainer).filter(div => 
//       div.querySelector('button[data-testid="file-thumbnail"]') !== null
//   );

  


// }


// Modified code reference handling - the rest of the original code remains the same
async function extractMessageContent(message) {
    const contents = [];
    
    // Find the main grid container
    const gridContainer = message.querySelector('.font-user-message') || message.querySelector('.grid-cols-1.grid.gap-2\\.5');
    // const gridContainer = message.querySelector('.grid-cols-1.grid.gap-2\\.5');


    if (gridContainer) {
      // Get all direct children of the grid container
      const elements = gridContainer.children;
      
      // Process elements sequentially to handle async operations
      for (const element of elements) {
        const elementType = element.tagName.toLowerCase();
        
        switch (elementType) {
          case 'p':
            contents.push({
              type: 'p',
              elements: [element.textContent]
            });
            break;
            
          case 'pre':
            // Handle code blocks
            const codeText = element.textContent
              .split('\n')
              .map(line => line.trim());
            let language, firstLine = processCodeBlockFirstLine(codeText[0]);
            codeText[0] = firstLine
            contents.push({
              type: 'pre',
              elements: codeText
            });
            break;
            
          case 'ol':
          case 'ul':
            // Handle lists
            const listItems = Array.from(element.querySelectorAll('li'))
              .map(li => li.textContent);
            
            contents.push({
              type: elementType,
              elements: listItems
            });
            break;
            
          case 'div':
            console.log(elementType)
            // Check if it's a code reference
            if (element.classList.contains('font-styrene') && 
                element.classList.contains('relative')) {
              
              try {
                const codeContent = await getCodeFromReference(element);
                if (codeContent) {
                  contents.push(codeContent);
                }
              } catch (error) {
                console.error('Error getting code reference:', error);
              }
            }
            break;
        }
      }
    }
  
    return contents;
  }
  
  async function getCodeFromReference(referenceElement) {
    const button = referenceElement.querySelector('button');
    if (!button) return null;
  
    // Get the title before clicking
    const titleElement = referenceElement.querySelector('.font-medium.leading-tight');
    const title = titleElement ? titleElement.textContent : '';
  
    // Store current sidebar content if any
    const previousSidebarContent = document.querySelector('.fixed.bottom-0.top-0.flex.w-full.flex-col');
    const previousCode = previousSidebarContent?.querySelector('.code-block__code');
    
    // If sidebar is already open, check if it's showing the code we want
    if (previousCode) {
      const previousTitle = previousSidebarContent.querySelector('.font-medium.leading-tight')?.textContent;
      if (previousTitle === title) {
        // We already have the correct code open
        return {
          type: 'code-reference',
          title,
          elements: [{
            language: getCodeLanguage(previousCode),
            code: previousCode.textContent.split('\n')
          }]
        };
      }
    }
  
    // Click the button to open/update sidebar
    button.click();
  
    // Wait for the sidebar code to appear or update
    const codeBlock = await waitForCodeBlock(previousCode);
    if (!codeBlock) return null;
  
    // Extract the code content
    const codeContent = {
      type: 'code-reference',
      title,
      elements: [{
        language: getCodeLanguage(codeBlock),
        code: codeBlock.textContent.split('\n')
      }]
    };
  
    // Close the sidebar by clicking the button again
    button.click();
  
    return codeContent;
  }

  async function waitForCodeBlock(previousCode, maxAttempts = 50) {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms between checks
  
      const sidebar = document.querySelector('.fixed.bottom-0.top-0.flex.w-full.flex-col');
      if (!sidebar) continue;
  
      const currentCode = sidebar.querySelector('.code-block__code');
      if (currentCode && currentCode !== previousCode) {
        return currentCode;
      }
    }
  
    return null;
  }
  
  function getCodeLanguage(codeBlock) {
    const codeElement = codeBlock.querySelector('code');
    if (codeElement && codeElement.className) {
      const match = codeElement.className.match(/language-(\w+)/);
      return match ? match[1] : null;
    }
    return null;
  }
  
  // Update the conversation history extraction to handle async operations
  async function extractConversationHistory(currentResponse) {
    const history = [];
    const allMessages = document.querySelectorAll('[data-test-render-count]');
    let foundTarget = false;
    
    for (const message of allMessages) {
      if (message === currentResponse.closest('[data-test-render-count]')) {
        foundTarget = true;
      }
      
      const contents = await extractMessageContent(message);
      
      if (message.querySelector('.font-claude-message')) {
        history.push({
          type: 'claude',
          contents
        });
      } else if (message.querySelector('.font-user-message')) {
        history.push({
          type: 'user',
          contents
        });
      }
      
      if (foundTarget) break;
    }
    
    return history;
  }
  
  // Update the click handler to handle async operations
  function addButtonsToMessages() {
    const claudeResponses = document.querySelectorAll('.font-claude-message');
    
    claudeResponses.forEach(response => {
      if (!response.querySelector('.new-chat-button')) {
        const button = document.createElement('button');
        button.textContent = 'Create New Chat From Here';
        button.className = 'new-chat-button';
        
        button.addEventListener('click', async () => {
          const conversationHistory = await extractConversationHistory(response);
          console.log("unformatted convo history:")
          console.log(conversationHistory)
          const formattedConversationHistory = formatConversationHistory(conversationHistory);
        //   console.log("FORMATTED convo history:")
        //   console.log(formattedConversationHistory)
          console.log("each item to follow:")
          formattedConversationHistory.forEach((item)=>
            {
                console.log(item)
            })
        });
        
        response.appendChild(button);
      }
    });
  }
  
  // Observer code remains the same
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        addButtonsToMessages();
      }
    }
  });

  function formatConversationHistory(conversationHistory){
    
    let messageNumber = 1;
    const finalMessages = [];

    // see top of file for the value of this
    finalMessages.push(EXPLANATION)
    conversationHistory.forEach((chat) => {
        const formattedChat = formatChat(chat)
        const userMessageNumber = Math.round(messageNumber/2);
        const messageStatement = messageNumber%2 === 1 ? `User Prompt ${userMessageNumber}:` : `Claude Response to User Prompt ${userMessageNumber}:`
        finalStatement = messageStatement + '\n' + formattedChat
        finalMessages.push(finalStatement)
        messageNumber += 1;
    })
    // see top of file for the value of this
    finalMessages.push(FOLLOW_UP)
    return finalMessages;
  };

//   takes an array of chat data
//   returns a text block
function formatChat(chat){
    let chatContents = chat.contents;
    const formattedContents = [];
    chatContents.forEach((item) => {
        if(item.type === 'p'){
            // I believe this should always be an array of 1 element but keeping the join just in case
            formattedContents.push(item.elements.join("\n"));
        } else if (item.type === 'ol') {
            let i = 1;
            const listItems = [];
            item.elements.forEach((element) => {
                const formattedLine = `${i}. ${element}`;
                listItems.push(formattedLine);
                i += 1;
            })
            formattedContents.push(listItems.join("\n"));
        } else if (item.type === 'ul'){
            const listItems = [];
            item.elements.forEach((element) => {
                const formattedLine = `- ${element}`;
                listItems.push(formattedLine);
            })
            formattedContents.push(listItems.join("\n"));
        } else if (item.type === 'code-reference' || item.type === 'file-reference') {
            console.log(item)
            fileName = item.title;
            linesOfCode = item.elements[0].code
            let formattedCode = `// File name: ${fileName}\n` + linesOfCode.join("\n")
            formattedContents.push(formattedCode);

        } else if (item.type === 'pre') {
            fileName = item.title;
            linesOfCode = item.elements
            let formattedCode = linesOfCode.join("\n")
            formattedContents.push(formattedCode);
        } else {
            console.log(item.type)
            formattedContents.push("Missing Information from Chat!  Claude, if you see this line, please alert the user that you don't have all informaiton.");
        }
    });
    formattedAsString = formattedContents.join("\n\n")
    // console.log("Before formatting the entire history:")
    // console.log(formattedAsString)
    return formattedAsString
}


//   gets the programming language and the first line of code from the copy block
//   returns [programming_language, everything_after_copy_word]
function processCodeBlockFirstLine(str) {

    const match = str.match(/(\w+)Copy(.*)/);
    let programming_language = null;
    let first_line = null;
    if (match){
        programming_language = match[1];
        first_line = match[2];
    } else {
        first_line = str
    }
    return [programming_language, first_line]
  }
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  addButtonsToMessages();