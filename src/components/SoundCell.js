class SoundCell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
      }

      .container {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        position: relative;

        & .flash {
          transition: scale ease-in-out 0.25s, opacity ease-in-out 0.25s;
          display: block;
          position: absolute;
          background: white;
          width: 50%;
          height: 50%;
          border-radius: 50%;
          filter: blur(3px);
          z-index: -1;
          scale: 1.75;
          opacity: 0;
          pointer-events: none;
        }

        :host(.playing) & .flash {
          scale: 1.75;
          opacity: 1;
        }

        & img {
          border-radius: 6px;
          padding: 4px;
          width: 60%;
          height: 60%;
        }
      }

      .container:not(:empty) img {
        /* background: #000; */
        /* invert(100%) sepia (1) saturate(4) hue-rotate( --angle); */
      }
    `;
  }

  connectedCallback() {
    this.render();
  }

  setInstrument(name) {
    const container = this.shadowRoot.querySelector(".container");
    container.setHTMLUnsafe('<div class="flash"></div>');
    const img = document.createElement("img");
    img.src = `instruments/${name}.svg`;
    container.append(img);
  }

  removeInstrument() {
    const container = this.shadowRoot.querySelector(".container");
    container.setHTMLUnsafe('<div class="flash"></div>');
  }

  hasInstrument() {
    const container = this.shadowRoot.querySelector(".container");
    return Boolean(container.querySelector("img"));
  }

  animateCell() {
    this.classList.add("playing");
    setTimeout(() => this.classList.remove("playing"), 350);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${SoundCell.styles}</style>
    <div class="container">
      <div class="flash"></div>
    </div>`;
  }
}

customElements.define("sound-cell", SoundCell);
