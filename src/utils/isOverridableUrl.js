import { DOMAINS } from '../consts/domains.js';

// Exact host match: host_permissions cover exactly these hosts, so the override rules don't apply
// on their subdomains.
export function isOverridableUrl(url) {
  try {
    return DOMAINS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}
