declare global {
  interface Window {
    pannellum: {
      viewer: (container: HTMLElement | string, config: PannellumConfig) => PannellumViewer;
    };
  }
}

export interface PannellumConfig {
  type: 'equirectangular';
  panorama: string;
  pitch?: number;
  yaw?: number;
  hfov?: number;
  autoLoad?: boolean;
  showControls?: boolean;
  mouseZoom?: boolean;
}

export interface PannellumViewer {
  on: (event: string, callback: (...args: any[]) => void) => void;
  addHotSpot: (hotspot: PannellumHotspot) => void;
  removeHotSpot: (id: string) => void;
  loadScene: (config: PannellumConfig) => void;
  destroy: () => void;
}

export interface PannellumHotspot {
  id: string;
  pitch: number;
  yaw: number;
  type: 'custom';
  cssClass?: string;
  createTooltipFunc?: (hotSpotDiv: HTMLElement) => void;
  clickHandlerFunc?: () => void;
}

export {};
