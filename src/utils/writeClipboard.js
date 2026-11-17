export async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // DevTools embeds extension panels without the clipboard-write Permissions Policy
    const focused = document.activeElement;
    const input = document.createElement('textarea');

    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.tabIndex = -1;
    input.setAttribute('aria-hidden', 'true');
    document.body.append(input);
    try {
      input.focus();
      input.select();
      if (!document.execCommand('copy')) {
        throw error;
      }
    } finally {
      input.remove();
      focused?.focus();
    }
  }
}
