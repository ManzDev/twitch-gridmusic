import "./SoundCell.js";
import "./GridLines.js";
import { playSong } from "../instruments/playSong.js";

class SoundPool extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.NUM_CELLS = 10;
    this.style.setProperty("--num-cells", this.NUM_CELLS);

    this.pairInstruments = [];
  }

  static get styles() {
    return /* css */`
      :host {
        --gap-size: 1px;
        --pool-size: calc((var(--num-cells) * var(--cell-size)) + ((var(--num-cells) - 1) * var(--gap-size)));
      }

      .container {
        display: grid;
        grid-template-columns: repeat(var(--num-cells), var(--cell-size));
        grid-template-rows: repeat(var(--num-cells), var(--cell-size));
        background-color: grey;
        background-image:
          repeating-linear-gradient(
            to right,
            transparent 0px var(--cell-size),
            #555 var(--cell-size) calc(var(--cell-size) + var(--gap-size))
          ),
          repeating-linear-gradient(
            to bottom,
            transparent 0px var(--cell-size),
            #555 var(--cell-size) calc(var(--cell-size) + var(--gap-size))
          );
        gap: var(--gap-size);
        width: var(--pool-size);
        height: var(--pool-size);
        position: relative;

        & sound-cell {
          z-index: 5;
        }
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.createCells();
    this.addListeners();
    this.data = [
      /*{name: "play",volume:1,id:42,next:[62,44]},
        {name:"acoustic_shaker",volume:1,id:44,next:[42,46,64]},
        {name:"bongo_hit",volume:1,id:62,next:[42]},
        {name:"snare-5",volume:1,id:46,next:[44,48]},
        {name:"sidestick",volume:1,id:48,next:[46]},
        {name:"tumba",volume:1,id:64,next:[44]}*/
      { name: "play", volume: 1, id: 42, next: [] }
    ];
    this.renderInstruments();
    this.gridlines = this.shadowRoot.querySelector("grid-lines");
  }

  createCells() {
    const container = this.shadowRoot.querySelector(".container");
    for (let i = 0; i < this.NUM_CELLS * this.NUM_CELLS; i++) {
      const cell = document.createElement("sound-cell");
      cell.dataset.index = i;
      container.append(cell);
    }
  }

  playSong() {
    playSong(this.data);
  }

  addListeners() {
    const container = this.shadowRoot.querySelector(".container");
    container.addEventListener("click", (ev) => {
      const isCell = ev.target.nodeName === "SOUND-CELL";
      const name = document.querySelector("grid-music").currentInstrument;

      if (isCell && name) {
        const hasInstrument = ev.target.hasInstrument();

        if (hasInstrument) {
          if (this.pairInstruments.length < 2) {
            this.pairInstruments.push(Number(ev.target.dataset.index));
          }
          if (this.pairInstruments.length === 2) {
            const [i1, i2] = this.pairInstruments;

            this.gridlines.addLine(i1, i2);
            const inst1 = this.data.find(item => item.id === i1);
            const inst2 = this.data.find(item => item.id === i2);
            inst1.next.push(i2);
            inst2.next.push(i1);

            this.pairInstruments.length = 0;
          }
          return;
        }

        ev.target.setInstrument(name);
        this.data.push({
          name,
          volume: 1,
          id: Number(ev.target.dataset.index),
          next: []
        });
      }
    });

    container.addEventListener("contextmenu", (ev) => {
      const isCell = ev.target.nodeName === "SOUND-CELL";
      const instrument = this.data.find(item => item.id === Number(ev.target.dataset.index)).name;

      if (isCell) {
        if (instrument === "play") return;
        ev.preventDefault();
        ev.target.removeInstrument();
        this.data = this.data.filter(item => item.id != ev.target.dataset.index)
      }
    })
  }

  renderInstruments() {
    const cells = [...this.shadowRoot.querySelectorAll(".container sound-cell")];

    this.data.forEach(({ name, id }) => {
      cells[id].setInstrument(name);
    });
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${SoundPool.styles}</style>
    <div class="container">
      <grid-lines cells="${this.NUM_CELLS}"></grid-lines>
    </div>`;
  }
}

customElements.define("sound-pool", SoundPool);
