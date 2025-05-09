declare module 'wordcloud' {
  type WordCloudList = Array<[string, number]>;

  interface WordCloudOptions {
    list: WordCloudList;
    fontFamily?: string;
    fontWeight?: string | number;
    color?: string | ((word: string, weight: number, fontSize: number) => string);
    backgroundColor?: string;
    minRotation?: number;
    maxRotation?: number;
    rotationSteps?: number;
    minSize?: number;
    weightFactor?: number | ((weight: number) => number);
    drawOutOfBound?: boolean;
    shrinkToFit?: boolean;
    gridSize?: number;
    origin?: [number, number];
    shape?: string;
    ellipticity?: number;
    classes?: (word: string, weight: number) => string;
  }

  function WordCloud(
    canvas: HTMLCanvasElement,
    options: WordCloudOptions
  ): void;

  export default WordCloud;
}
