const percentChartUrl = document.currentScript.src;

customElements.define(
    "percent-chart",
    class extends HTMLElement {
        constructor() {
            super();
            this._data = [];
            this._collapsedCount = 10;
            document.head.append(this.createStylesLink());
        }

        createStylesLink() {
            const style = document.createElement("link");
            style.href = new URL("./percent-chart.css", percentChartUrl).href;
            style.rel = "stylesheet";
            style.type = "text/css";
            return style;
        }

        get data() {
            return this._data;
        }

        set data(value) {
            this._data = Array.isArray(value) ? value : [value];
            this._data.sort((a, b) => b.percent - a.percent);
            this.render();
        }

        get collapse() {
            return this._collapse;
        }

        set collapse(value) {
            this._collapse =
                value === "false" ? false : value === "" || !!value;
            this.render();
        }

        render() {
            this.replaceChildren(this.createChart());
        }

        createChart() {
            const chart = document.createElement("div");
            chart.classList.add("percent-chart");
            const dataToShow = this.collapse
                ? this.data.slice(0, this._collapsedCount)
                : this.data;
            for (let bar of dataToShow) {
                const label_before = document.createElement("label");
                label_before.classList.add("percent-chart__label_before");
                label_before.innerText = bar.before;

                const pb = document.createElement("percent-bar");
                pb.setAttribute("percent", bar.percent);

                const label_after = document.createElement("label");
                label_after.classList.add("percent-chart__label_after");
                label_after.innerText = bar.after;

                chart.append(label_before);
                chart.append(pb);
                chart.append(label_after);
            }

            chart.append(this.createShowMore());
            return chart;
        }

        createShowMore() {
            const showMore = document.createElement("button");
            showMore.textContent = this.collapse
                ? "Показать больше"
                : "Показать первые " + this._collapsedCount;
            showMore.addEventListener("click", () => {
                this.collapse = !this.collapse;
            });
            return showMore;
        }

        static get observedAttributes() {
            return ["loaddata", "collapse"];
        }

        set loaddata(value) {
            if (value instanceof Promise) {
                value.then((data) => (this.data = data));
            }
            this.data = value instanceof Function ? value() : value;
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "loaddata":
                    const evalNewValue = eval(newValue);
                    this.data =
                        evalNewValue instanceof Function
                            ? evalNewValue()
                            : evalNewValue;
                    break;
                case "collapse":
                    this.collapse = newValue;
                    break;
            }
        }
    }
);
