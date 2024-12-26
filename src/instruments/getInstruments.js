export const getInstruments = () => {
  const files = import.meta.glob("../../public/instruments/*.flac");
  const instruments = Object.keys(files)
    .map(key => {
      return key.split("/").at(-1).replace(".flac", "");
    })
    .filter(key => key !== "play");
  return instruments;
}
