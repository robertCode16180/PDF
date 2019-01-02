/**
 * Representation of the loading progress
 */
export class SimpleProgressData {

    constructor(public loaded: number, public total: number) {
    }
}

export class PageContainerUnique {

    width: number;
    height: number;
    element: HTMLElement;
    canvas: HTMLCanvasElement;
    canvasWrapper: HTMLElement;

    constructor() {
        this.width = 0;
        this.height = 0;
    }
}

export enum RenderTextMode {
    DISABLED,
    ENABLED,
    ENHANCED
}
