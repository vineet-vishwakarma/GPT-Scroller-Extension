function collectUserMessages() {
    const userMessages = Array.from(document.querySelectorAll('.whitespace-pre-wrap'));
  
    return userMessages.map((el, i) => {
      if (!el.id) el.id = `chatgpt-user-msg-${i}`;
      return {
        id: el.id,
        text: el.innerText.slice(0, 100) + (el.innerText.length > 100 ? "..." : "")
      };
    });
  }
  
  let messages = collectUserMessages();
  
  const observer = new MutationObserver(() => {
    messages = collectUserMessages();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "getUserMessages") {
      sendResponse({ messages });
    }
  
    if (msg.action === "scrollToUserMessage") {
      const el = document.getElementById(msg.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.backgroundColor = "#3B82F6";
        setTimeout(() => {
          el.style.backgroundColor = "";
        }, 1000);
      }
    }
  });
  