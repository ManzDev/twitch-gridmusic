class InstrumentSound extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        border: 2px solid transparent;
        border-radius: 5px;
      }

      :host(.active) {
        border: 2px solid gold;
      }

      .container {
        background: black;
        width: var(--cell-size);
        height: var(--cell-size);
        display: grid;
        place-items: center;
        border-radius: inherit;

        & img {
          width: 60%;
          height: 60%;
          filter: invert(100%);
        }
      }
    `;
  }

  play() {
    this.sound.play();
  }

  connectedCallback() {
    this.name = this.getAttribute("name");
    this.sound = new Audio(`instruments/${this.name}.flac`);
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${InstrumentSound.styles}</style>
    <div class="container">
      <img src="instruments/${this.name}.svg">
    </div>`;
  }
}

customElements.define("instrument-sound", InstrumentSound);
