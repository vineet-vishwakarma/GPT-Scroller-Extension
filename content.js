function collectUserMessages() {
  let userMessages = [];

  const hostNameMap = new Map([
    ["chatgpt.com", ".whitespace-pre-wrap"],
    ["claude.ai", ".font-user-message"],
    ["gemini.google.com", ".query-text"],
    ["perplexity.ai", ".whitespace-pre-line"],
    ["chat.deepseek.com", ".fbb737a4"]
  ]);

  hostNameMap.forEach((selector, host) => {
    if (location.hostname.includes(host)) {
      userMessages = Array.from(document.querySelectorAll(selector));
    }
  });

  return userMessages.map((el, i) => {
    if (!el.id) el.id = `gpt-user-msg-${i}`;
    console.log(el.id);
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