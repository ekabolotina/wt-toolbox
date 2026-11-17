export class FEHistoryWorker {
  worker = new Worker(new URL('../vendor/feHistory.worker.js', import.meta.url), {
    type: 'module',
    name: 'FEHistory',
  });
  requests = new Map();
  id = 0;

  constructor() {
    this.worker.onmessage = ({ data }) => {
      if (data.accepted) {
        return;
      }

      const pending = this.requests.get(data.id);

      this.requests.delete(data.id);
      clearTimeout(pending?.timer);
      if (data.error) {
        pending?.reject(new Error(data.error));
      } else {
        pending?.resolve(data.value);
      }
    };
    this.worker.onerror = () =>
      this.destroy(new Error('Worker истории расширения FE завершился с ошибкой'));
  }

  rpc(command) {
    if (this.closed || this.requests.size >= 32) {
      return Promise.reject(new Error('Worker FE закрыт или занят'));
    }

    const id = ++this.id;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.requests.delete(id);
        reject(new Error('Истекло время ожидания истории FE'));
      }, 120000);

      this.requests.set(id, { resolve, reject, timer });
      try {
        this.worker.postMessage({ id, command });
      } catch (error) {
        this.requests.delete(id);
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  async close() {
    try {
      await this.rpc({ method: 'close' });
    } finally {
      this.destroy(new Error('История FE закрыта'));
    }
  }

  destroy(error) {
    this.closed = true;
    this.worker.terminate();
    for (const pending of this.requests.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }

    this.requests.clear();
  }
}
