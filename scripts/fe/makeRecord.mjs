export function makeRecord(message, meta) {
  const json = JSON.stringify(message);

  return { ...meta, entity: message.type, json, bytes: new TextEncoder().encode(json).byteLength };
}
