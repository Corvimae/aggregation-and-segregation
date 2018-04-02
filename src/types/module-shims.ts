declare module "vue-color" {
  import { Vue } from "vue-property-decorator";

  export type ColorPickerResult = {
    a: number,
    hex: string,
    hsl: HSLValue,
    hsv: HSVValue,
    oldHue: number,
    rgba: RGBAValue,
    source: string,
  }

  export type HSLValue = {
    h: number,
    l: number,
    s: number,
    a: number
  }

  export type HSVValue = {
    h: number,
    s: number,
    v: number,
    a: number
  }

  export type RGBAValue = {
    r: number,
    g: number,
    b: number,
    a: number
  }

  export class Material extends Vue { }
  export class Compact extends Vue { }
  export class Swatches extends Vue { }
  export class Slider extends Vue { }
  export class Sketch extends Vue { }
  export class Chrome extends Vue { }
  export class Photoshop extends Vue { }
}

declare module "vue-clickaway";
declare module "melanke-watchjs" {
  export type WatchCallback = (prop: string, action: string, newValue: any, oldValue: any) => void;
  export function watch(object: any, attributeOrCallback: WatchCallback | string, callback?: WatchCallback): void;
}