import { getInstruments } from "./getInstruments.js";

const instruments = {
  play: new Audio(`instruments/play.flac`)
};

getInstruments().forEach(name => {
  instruments[name] = new Audio(`instruments/${name}.flac`);
});

function organizeByLevels(startNode, data) {
  const nodesMap = new Map();
  // Crear un mapa para acceso rápido a los nodos por id
  data.forEach(node => {
      nodesMap.set(node.id, node);
  });

  const songs = []; // Array para almacenar los niveles
  const visited = new Set(); // Conjunto para evitar visitar nodos varias veces
  let currentLevel = [startNode]; // Nivel inicial con el nodo de arranque

  while (currentLevel.length > 0) {
      songs.push(currentLevel); // Agregar el nivel actual al resultado
      const nextLevel = []; // Crear el siguiente nivel

      currentLevel.forEach(node => {
          if (visited.has(node.id)) return; // Saltar nodos ya visitados
          visited.add(node.id); // Marcar como visitado

          // Agregar los nodos adyacentes al siguiente nivel
          node.next.forEach(nextId => {
              if (!visited.has(nextId)) {
                  nextLevel.push(nodesMap.get(nextId));
              }
          });
      });

      currentLevel = nextLevel; // Avanzar al siguiente nivel
  }

  return songs;
}

export const playSong = (data) => {

  const DURATION = 250;
  const startNode = data.find(item => item.name === "play");
  const song = organizeByLevels(startNode, data);

  song.forEach((ticks, index) => {
    ticks.forEach((node) => {
      setTimeout(() => {
        instruments[node.name].play();
        // animateCell();
      }, DURATION * index);
    });
  });

}


/*

[
  [ 1, 2, 3 ],
  [ 4, ],
  [ 5, 6, 7]
]

*/
