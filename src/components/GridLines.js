const SVG_NS = "http://www.w3.org/2000/svg";

class GridLines extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      svg.lines {
        position: absolute;

        & line {
          stroke-width: 0.75px;
          stroke: red;
          /* stroke-dasharray: 0 200;
          stroke-dashoffset: 0;*/
        }
      }
    `;
  }

  connectedCallback() {
    this.NUM_CELLS = this.getAttribute("cells");
    this.render();
    this.svg = this.shadowRoot.querySelector("svg");
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${GridLines.styles}</style>
    <svg viewBox="0 0 ${this.NUM_CELLS * this.NUM_CELLS} ${this.NUM_CELLS * this.NUM_CELLS}" class="lines">
    </svg>`;
  }

  // 42, 43
  addLine(startIndex, endIndex) {
    const start = {
      x: startIndex % this.NUM_CELLS,
      y: Math.trunc(startIndex / this.NUM_CELLS)
    }

    const x1 = (start.x * this.NUM_CELLS) + (this.NUM_CELLS / 2);
    const y1 = (start.y * this.NUM_CELLS) + (this.NUM_CELLS / 2);

    const end = {
      x: endIndex % this.NUM_CELLS,
      y: Math.trunc(endIndex / this.NUM_CELLS)
    }

    const x2 = (end.x * this.NUM_CELLS) + (this.NUM_CELLS / 2);
    const y2 = (end.y * this.NUM_CELLS) + (this.NUM_CELLS / 2);

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    this.svg.append(line);
  }
}

customElements.define("grid-lines", GridLines);
