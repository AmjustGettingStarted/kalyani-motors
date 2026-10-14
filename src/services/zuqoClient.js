import { zuqoClient as zuqoFetch } from './api.js';
import { submitEnquiry } from './kalyaniApi.js';

const ZUQO_CAMPAIGN_ID = '688c5d85d5e83faa10312c15';
const ZUQO_PROCESS = 'KAM';

function cityToZuqoRouting(city) {
  const c = city?.toLowerCase() ?? '';
  if (c.includes('bengaluru') || c.includes('bangalore')) return 'website_bnglre';
  if (c.includes('mysore')) return 'website_mys';
  if (c.includes('hyderabad') || c.includes('hydrabad')) return 'website_hyd';
  return '';
}

async function resolveZuqoSkill(location) {
  try {
    const result = await zuqoFetch('admin/getRoutingSkillForUpload/', {
      process: ZUQO_PROCESS,
      mobileNumber: cityToZuqoRouting(location),
    });
    return result?.data?.selectedDid ?? null;
  } catch (err) {
    console.warn('[Zuqo Skill Resolution Failed]:', err);
    return null;
  }
}

async function uploadLeadToZuqo(leadData, skillData) {
  return zuqoFetch('admin/campaign/uploadLeadsToWeb', [
    {
      Name: leadData.name,
      'Phone Number': leadData.phone,
      'Email Address': leadData.email ?? '',
      emailAddress: leadData.email ?? '',
      crmSource: 'KM Website',
      creAgent: skillData?.agentId ?? '',
      agentId: skillData?.agentId ?? '',
      skill: skillData?.skill ?? '',
      process: ZUQO_PROCESS,
      campaignId: ZUQO_CAMPAIGN_ID,
      campaignName: 'Kalyani Motors',
      requestFrom: 'website',
      uniquePhone: true,
      modelName: leadData.vehicle ?? leadData.model ?? '',
      purpose: leadData.purpose,
      location: leadData.location ?? leadData.city ?? '',
    },
  ]);
}

async function runZuqoPipeline(leadData) {
  const skillData = await resolveZuqoSkill(leadData.location ?? leadData.city);
  return uploadLeadToZuqo(leadData, skillData);
}

/**
 * PRIMARY EXPORT: submitLead()
 *
 * Dispatches to BOTH the internal API and Zuqo CRM simultaneously.
 * Uses Promise.allSettled so a Zuqo failure NEVER blocks the internal lead.
 *
 * @param {object} leadData
 * @param {string} leadData.name       - Customer full name
 * @param {string} leadData.phone      - 10-digit mobile
 * @param {string} [leadData.email]    - Customer email (optional)
 * @param {string} leadData.city       - Canonical city (e.g. "Bengaluru")
 * @param {string} leadData.location   - Branch address or city name
 * @param {string} [leadData.vehicle]  - Car model name
 * @param {string} [leadData.model]    - Alternate car model name field
 * @param {string} leadData.purpose    - Lead intent string
 */
export async function submitLead(leadData) {
  const internalPayload = {
    name: leadData.name,
    phone: leadData.phone,
    email: leadData.email ?? '',
    city: leadData.city,
    location: leadData.location ?? leadData.city,
    vehicle: leadData.vehicle ?? leadData.model ?? '',
    purpose: leadData.purpose,
  };

  const [internalResult, zuqoResult] = await Promise.allSettled([
    submitEnquiry(internalPayload),
    runZuqoPipeline(leadData),
  ]);

  // Propagate internal API failure as a thrown error (forms show error state)
  if (internalResult.status === 'rejected') {
    throw new Error(internalResult.reason?.message ?? 'Enquiry submission failed');
  }

  // Log Zuqo failure silently — lead is already saved internally
  if (zuqoResult.status === 'rejected') {
    console.warn('[Zuqo CRM] Lead upload failed (non-blocking):', zuqoResult.reason);
  }

  return { internal: internalResult.value, zuqo: zuqoResult.value ?? null };
}
