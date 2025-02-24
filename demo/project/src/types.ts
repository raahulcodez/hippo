export interface DetectedObject {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

export interface ImageUpload {
  id: string;
  imageUrl: string;
  uploadDate: Date;
  detectedObjects: DetectedObject[];
}