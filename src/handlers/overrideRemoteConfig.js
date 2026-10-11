import { DOMAINS } from '../consts/domains.js';
import { getAppliedOverrides } from '../utils/getAppliedOverrides.js';
import { updateDynamicRules } from '../utils/updateDynamicRules.js';

// Kept clear of overridePR's positional ids 1..DOMAINS.length.
const RULE_ID = 1000;

// Chrome escapes keys and values itself, so they go into the rule as plain strings.
function buildQueryTransform(flags) {
  const added = getAppliedOverrides(flags);
  const removed = new Set(
    flags
      .filter(({ enabled }) => !enabled)
      .map(({ key }) => key.trim())
      .filter((name) => name && !added.has(name)),
  );
  const queryTransform = {};

  if (added.size > 0) {
    queryTransform.addOrReplaceParams = [...added].map(([key, value]) => ({ key, value }));
  }

  if (removed.size > 0) {
    queryTransform.removeParams = [...removed];
  }

  return queryTransform;
}

function buildRules(flags) {
  const queryTransform = buildQueryTransform(flags);

  if (Object.keys(queryTransform).length === 0) {
    return [];
  }

  return [
    {
      id: RULE_ID,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { transform: { queryTransform } },
      },
      condition: {
        requestDomains: DOMAINS,
        resourceTypes: ['main_frame'],
      },
    },
  ];
}

export const overrideRemoteConfig = async (flags) => {
  await updateDynamicRules({ removeRuleIds: [RULE_ID], addRules: buildRules(flags) });
};
