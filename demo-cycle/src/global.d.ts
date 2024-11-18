// src/global.d.ts
interface Window {
  ImageCapture: typeof ImageCapture;
}

declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  takePhoto(): Promise<Blob>;
  grabFrame(): Promise<ImageBitmap>;
}
