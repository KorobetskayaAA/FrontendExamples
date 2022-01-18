customElements.define(
    "percent-bar",
    class extends HTMLElement {
        constructor() {
            super();
            this._localeFormat = new Intl.NumberFormat(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2,
            });
            this.createShadow();
        }
        get percent() {
            return this.getAttribute("percent") || 0;
        }
        set percent(value) {
            if (value < 0) value = 0;
            if (value > 100) value = 100;
            return this.setAttribute("percent", value);
        }
        get color() {
            return this.getAttribute("color");
        }
        set color(value) {
            return this.setAttribute("color", value);
        }

        createStylesLink() {
            const style = document.createElement("link");
            style.href = "./css/percent-bar.css";
            style.rel = "stylesheet";
            style.type = "text/css";
            return style;
        }

        createShadowRoot() {
            const root = document.createElement("div");
            root.classList.add("percent-bar__root");

            const bg = document.createElement("div");
            bg.classList.add("percent-bar__bg");
            root.append(bg);

            const fulfilled = document.createElement("div");
            fulfilled.classList.add("percent-bar__fulfilled");
            root.append(fulfilled);

            const dataLabel = document.createElement("div");
            dataLabel.classList.add("percent-bar__dataLabel");
            root.append(dataLabel);

            return root;
        }

        createShadow() {
            const shadow = this.attachShadow({
                mode: "open",
            });

            shadow.append(this.createStylesLink());
            shadow.append(this.createShadowRoot());
        }

        updatePercent(value) {
            const shadow = this.shadowRoot;
            const fulfilled = shadow.querySelector(".percent-bar__fulfilled");
            const dataLabel = shadow.querySelector(".percent-bar__dataLabel");
            if (!fulfilled || !dataLabel) return;
            fulfilled.style.width = value + "%";
            dataLabel.innerText = this._localeFormat.format(value) + "%";
        }

        updateColor(oldValue, newValue) {
            const shadow = this.shadowRoot;
            const root = shadow.querySelector(".percent-bar__root");
            if (!root) return;
            root.classList.remove(oldValue);
            root.classList.add(newValue);
        }

        static get observedAttributes() {
            return ["percent", "color"];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "percent":
                    this.updatePercent(newValue);
                    break;
                case "color":
                    this.updateColor(oldValue, newValue);
                    break;
            }
        }
    }
);
