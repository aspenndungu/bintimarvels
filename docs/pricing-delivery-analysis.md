# Pricing and delivery basis

Date: 14 July 2026
Status: Provisional launch model selected for preview; direct website payment remains disabled.

## Evidence reviewed

- `Extract_sales.csv` in the Binti/Mrembo finance comparison export.
- `Sales_orders.csv` and `Extract_orders.csv` for recorded bundle sizes, locations and totals.
- Cognito sales form definition for Till options.
- Binti/Mrembo core identity and existing online price artwork.
- Mombasa Road factory/warehouse location supplied by Lorna.

No customer names, phone numbers or other personal details are reproduced here.

## Catalogue decision

| Bundle | Product price | Evidence status |
|---|---:|---|
| 6 packs / 48 pads | KSh 500 | Repeated recorded online-sales price |
| 12 packs / 96 pads | KSh 900 | Repeated recorded online-sales price |
| 24 packs / 192 pads | KSh 1,550 | Existing online price artwork; smooth volume step, confirmation requested |
| 48 packs / 384 pads | KSh 2,650 | Repeated recorded online-sales price |

The website now uses one truthful single-pack product image on every bundle card and labels the actual bundle quantity separately. This avoids the former contradiction where bundle artwork showed a different visible pack count.

## Till decision

The website-launch merchant account selected from the existing finance information is:

- M-Pesa Buy Goods Till: **9392405**
- Account name: Binti Marvels Ltd
- Intended transaction type after approval: `CustomerBuyGoodsOnline`

The Till is not currently treated as Daraja-enabled. The preview therefore says **Direct M-Pesa coming soon**, creates no payment prompt, and tells customers not to pay until the Binti team confirms the order on WhatsApp.

## Delivery decision

The selected model is a simple three-zone model that can be explained before payment and operated from the Mombasa Road warehouse:

| Option | Fee | Free threshold | Scope |
|---|---:|---:|---|
| Mombasa Road warehouse pickup | KSh 0 | Always | Collection after WhatsApp confirmation |
| Nairobi metro delivery | KSh 150 | KSh 900 | Standard metro delivery; exact service-area list still required |
| Upcountry courier pickup | KSh 500 | KSh 5,300 | Delivery to an agreed town courier/pickup point, not guaranteed doorstep |

Why these numbers:

- Recorded online sales included a KSh 150 difference on a smaller Ruiru/Kamakis order.
- A recorded Kisumu shipment included a KSh 500 difference.
- Most recorded 12-pack metro orders showed no separate delivery difference, supporting free metro delivery from KSh 900.
- A recorded 96-pack order totalled approximately KSh 5,300, supporting a bulk free-shipping threshold at that level.

This is a commercially reasonable preview model, not proof of a courier contract. Binti must confirm actual provider rates, eligible areas, delivery periods and exception handling before automatic payment is enabled.
