chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id;

  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"]
  }, () => {
    if (chrome.runtime.lastError) {
      document.getElementById("title").textContent = "Error: " + chrome.runtime.lastError.message;
      return;
    }

    chrome.tabs.sendMessage(tabId, { action: "getUserMessages" }, (response) => {
      const title = document.getElementById("title");
      const contentDiv = document.getElementById("content");

      if (!response || !response.messages?.length) {
        title.textContent = "No messages found.";
        return;
      }

      title.textContent = "User Messages";
      title.style.color = "#ececec";

      response.messages.forEach(msg => {
        const item = document.createElement("div");
        item.textContent = msg.text;
        item.style.cursor = "pointer";
        item.style.color = "#ececec";
        item.style.textDecoration = "none"; 
        item.style.margin = "10px 0";
        item.style.padding = "12px 16px";
        item.style.backgroundColor = "#444654"; 
        item.style.borderRadius = "12px";
        item.style.maxWidth = "80%";
        item.style.lineHeight = "1.5";
        item.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        
        item.addEventListener("mouseover", () => {
          item.style.backgroundColor = "#53576b";
        });
        item.addEventListener("mouseout", () => {
          item.style.backgroundColor = "#444654";
        });

        item.addEventListener("click", () => {
          chrome.tabs.sendMessage(tabId, {
            action: "scrollToUserMessage",
            id: msg.id
          });
        });

        contentDiv.appendChild(item);
      });
    });
  });
});
