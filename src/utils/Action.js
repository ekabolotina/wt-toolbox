export class Action {
  constructor(name) {
    this.name = name;
  }

  execute(payload) {
    return chrome.runtime.sendMessage({ type: this.name, payload });
  }

  register(handler) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === this.name) {
        handler(message.payload).then(sendResponse);

        return true;
      }
    });
  }
}
