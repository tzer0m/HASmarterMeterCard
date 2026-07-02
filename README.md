# HASmarterMeter Card

A custom Lovelace card for Home Assistant that displays electricity usage and cost from the [HASmarterMeter integration](https://github.com/tzer0m/HASmarterMeter) at a glance.

## Requirements

This card requires the [HASmarterMeter integration](https://github.com/tzer0m/HASmarterMeter) to be installed and configured first. The card automatically discovers all HASmarterMeter entities — no manual entity configuration needed.

## What it shows

- **Current meter reading** in kWh and last read time
- **Reading success rate** as a percentage
- **Usage and cost** for today, last 7 days, and last 30 days

## Installation

### Via HACS (recommended)

1. In Home Assistant, go to HACS → three-dot menu → **Custom repositories**.
2. Add `https://github.com/tzer0m/HASmarterMeterCard`, category **Dashboard**.
3. Find **HASmarterMeter Card** in HACS and install it.
4. Restart Home Assistant.

### Manual

1. Copy `hasmartermeter-card.js` to `www/community/HASmarterMeterCard/` in your Home Assistant config directory.
2. Add `/local/community/HASmarterMeterCard/hasmartermeter-card.js` as a **JavaScript module** resource under Settings → Dashboards → Resources.
3. Hard reload the browser (**Ctrl+Shift+R**).

## Usage

Add the card to any dashboard using the manual card editor:

```yaml
type: custom:hasmartermeter-card
```

## License

Personal project, provided as-is.