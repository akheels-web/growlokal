# Data Model

Source of truth: `db/schema.sql`. This doc explains the *why*.

## Core entities

| Table | What it is | Notes |
|---|---|---|
| `businesses` | A customer (coaching center) = one tenant | `profile_context` (jsonb) feeds the LLM; `wa_credit_paise` is prepaid WhatsApp balance |
| `users` | Dashboard logins | Phone-OTP login; `role` = owner/staff/admin(your team) |
| `leads` | Top of funnel — captured by the audit bot **before** signup | `converted_business_id` links to a business once they subscribe |
| `audit_reports` | Each run of the free Google audit | `raw_signals`, `score_breakdown`, `gaps`, and the vernacular `summary_text` sent to the user |
| `wa_messages` | Every inbound/outbound WhatsApp message | `cost_paise` tracks Meta's per-message charge |
| `posts` | GBP/Instagram/FB content | `status` drives the scheduler; `external_id` from GBP/Mixpost |
| `campaigns` | WhatsApp marketing blasts | `cost_paise` debited from business credits |
| `reviews` | Google reviews + AI-drafted replies | `reply_draft` awaits owner approval |
| `subscriptions` | Razorpay billing | `amount_paise`, `current_period_end` |
| `events` | Lightweight analytics log | Powers the ROI dashboard via `v_monthly_enquiries` |

## Why leads are separate from businesses

The audit bot's whole point is to capture people who **aren't customers yet**. A `lead` has a phone + audit score + sales stage and exists independently. When they subscribe, you create a `business` and set `leads.converted_business_id`. This keeps your funnel metrics (how many audits → how many demos → how many paid) clean.

## Money handling

All money is **integer paise**. ₹999 = `99900`. Never use floats for money. Convert to rupees only at display time.

## The ROI view (your headline metric)

`v_monthly_enquiries` aggregates `events` into monthly counts of `enquiry_received`, `demo_booked`, `leads_captured` per business. The dashboard shows "You got X admission enquiries this month" — the single most important thing for retention, because coaching owners renew when they *see* the leads.

Emit an event wherever value happens:
- audit bot captures a lead → `lead_captured`
- a parent enquires via the WhatsApp bot → `enquiry_received`
- someone books a demo class → `demo_booked`
- a post publishes → `post_published`

## Multi-language

`lang` enum (`te`/`ta`/`kn`/`ml`/`hi`/`en`) is on businesses, posts, campaigns, and audit reports. Default `te` for Hyderabad. Add per-language WhatsApp templates as you expand.
