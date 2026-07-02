class HASmarterMeterCard extends HTMLElement {
    setConfig(config) {
        this.config = config;
    }

    set hass(hass) {
        this._hass = hass;

        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }

        if (!this._built) {
            this._build();
            this._built = true;
        }

        this._update();
    }

    _getEntity(suffix) {
        return Object.values(this._hass.states).find(
            e => e.attributes.friendly_name === `HASmarterMeter ${suffix}`
        );
    }

    _val(suffix) {
        const e = this._getEntity(suffix);
        return e ? parseFloat(e.state) : null;
    }

    _build() {
        this.shadowRoot.innerHTML = `
            <style>
                ha-card {
                    padding: 16px;
                }
                .top-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: stretch;
                    margin-bottom: 16px;
                    gap: 12px;
                }
                .current-reading {
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--primary-text-color);
                    background: var(--secondary-background-color);
                    border: 1px solid var(--divider-color);
                    border-radius: 8px;
                    padding: 8px 16px;
                    flex: 5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .success-rate {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--primary-text-color);
                    background: var(--secondary-background-color);
                    border: 1px solid var(--divider-color);
                    border-radius: 8px;
                    padding: 8px 16px;
                    white-space: nowrap;
                    flex: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .last-read {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--primary-text-color);
                    background: var(--secondary-background-color);
                    border: 1px solid var(--divider-color);
                    border-radius: 8px;
                    padding: 8px 16px;
                    white-space: nowrap;
                    flex: 3;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .grid {
                    display: grid;
                    grid-template-columns: auto 1fr 1fr 1fr;
                    border: 1px solid var(--divider-color);
                    border-radius: 8px;
                    overflow: hidden;
                }
                .grid-header {
                    background: var(--secondary-background-color);
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--secondary-text-color);
                    padding: 8px 12px;
                    text-align: center;
                    border-bottom: 1px solid var(--divider-color);
                    border-right: 1px solid var(--divider-color);
                }
                .grid-header:last-child {
                    border-right: none;
                }
                .grid-label {
                    background: var(--secondary-background-color);
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--secondary-text-color);
                    padding: 12px 10px;
                    display: flex;
                    align-items: center;
                    border-right: 1px solid var(--divider-color);
                    border-bottom: 1px solid var(--divider-color);
                }
                .grid-label:last-of-type {
                    border-bottom: none;
                }
                .grid-cell {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--primary-text-color);
                    padding: 12px 8px;
                    text-align: center;
                    border-right: 1px solid var(--divider-color);
                    border-bottom: 1px solid var(--divider-color);
                }
                .grid-cell:nth-child(4n) {
                    border-right: none;
                }
                .grid-cell.last-row {
                    border-bottom: none;
                }
                .unit {
                    font-size: 11px;
                    font-weight: 400;
                    color: var(--secondary-text-color);
                    margin-left: 4px;
                }
            </style>

            <ha-card>
                <div class="top-row">
                    <div class="current-reading" id="current-reading">— kWh</div>
                    <div class="last-read" id="last-read">Last Read: —</div>
                    <div class="success-rate" id="success-rate">—%</div>
                </div>
                <div class="grid">
                    <div class="grid-header"></div>
                    <div class="grid-header">Today</div>
                    <div class="grid-header">7d</div>
                    <div class="grid-header">30d</div>

                    <div class="grid-label">kWh</div>
                    <div class="grid-cell" id="usage-today">—</div>
                    <div class="grid-cell" id="usage-7d">—</div>
                    <div class="grid-cell" id="usage-30d">—</div>

                    <div class="grid-label" style="border-bottom:none;">£</div>
                    <div class="grid-cell last-row" id="cost-today">—</div>
                    <div class="grid-cell last-row" id="cost-7d">—</div>
                    <div class="grid-cell last-row" id="cost-30d">—</div>
                </div>
            </ha-card>
        `;
    }

    _update() {
        const currentReading = this._val("Current Reading");
        const currentEntity = this._getEntity("Current Reading");
        const lastRead = currentEntity?.attributes?.last_captured_at
            ? new Date(currentEntity.attributes.last_captured_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
            : "—";
        const successRate = this._val("Reading Success Rate");

        const usageToday = this._val("Usage Last 24 Hours");
        const usage7d = this._val("Usage Last 7 Days");
        const usage30d = this._val("Usage Last 30 Days");

        const costToday = this._val("Cost Last 24 Hours");
        const cost7d = this._val("Cost Last 7 Days");
        const cost30d = this._val("Cost Last 30 Days");

        this.shadowRoot.getElementById("current-reading").innerHTML = currentReading !== null ? `${currentReading.toLocaleString()} <span class="unit">kWh</span>` : "— kWh";
        this.shadowRoot.getElementById("last-read").textContent = `Last Read: ${lastRead}`;
        this.shadowRoot.getElementById("success-rate").textContent = successRate !== null ? `${successRate}%` : "—%";

        this.shadowRoot.getElementById("usage-today").textContent = usageToday !== null ? usageToday.toFixed(0) : "—";
        this.shadowRoot.getElementById("usage-7d").textContent = usage7d !== null ? usage7d.toFixed(0) : "—";
        this.shadowRoot.getElementById("usage-30d").textContent = usage30d !== null ? usage30d.toFixed(0) : "—";

        this.shadowRoot.getElementById("cost-today").textContent = costToday !== null ? `£${costToday.toFixed(2)}` : "—";
        this.shadowRoot.getElementById("cost-7d").textContent = cost7d !== null ? `£${cost7d.toFixed(2)}` : "—";
        this.shadowRoot.getElementById("cost-30d").textContent = cost30d !== null ? `£${cost30d.toFixed(2)}` : "—";
    }

    getCardSize() {
        return 3;
    }
}

customElements.define("hasmartermeter-card", HASmarterMeterCard);