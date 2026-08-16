export class Storage {
  constructor(key, { encode, decode } = {}) {
    this.key = key;
    this.encode = encode;
    this.decode = decode;
  }

  async save(data) {
    const value = this.encode ? this.encode(data, await this.get()) : data;

    await chrome.storage.local.set({ [this.key]: value });
  }

  async get() {
    const stored = await chrome.storage.local.get(this.key);

    return this.decode ? this.decode(stored[this.key]) : stored[this.key];
  }

  subscribe(onChange) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && this.key in changes) {
        this.get().then(onChange);
      }
    });

    this.get().then(onChange);
  }
}
