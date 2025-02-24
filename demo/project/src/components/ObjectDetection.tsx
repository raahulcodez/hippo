import React, { useEffect, useRef, useState } from 'react';
import { DetectedObject } from '../types';
import { Loader2 } from 'lucide-react';

interface ObjectDetectionProps {
  imageUrl: string;
  onDetectionComplete: (objects: DetectedObject[]) => void;
}

const ObjectDetection: React.FC<ObjectDetectionProps> = ({ imageUrl, onDetectionComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const simulateDetection = async () => {
      try {
        // Simulate detection with predefined objects
        const predefinedObjects: DetectedObject[] = [
          { class: 'Fish', score: 0.92, bbox: [0, 0, 0, 0] },
          { class: 'Tomato', score: 0.88, bbox: [0, 0, 0, 0] },
          { class: 'Eggs', score: 0.95, bbox: [0, 0, 0, 0] },
          { class: 'Chilly', score: 0.85, bbox: [0, 0, 0, 0] },
          { class: 'Cabbage', score: 0.89, bbox: [0, 0, 0, 0] },
          { class: 'Grapes', score: 0.91, bbox: [0, 0, 0, 0] },
          { class: 'Carrot', score: 0.94, bbox: [0, 0, 0, 0] },
          { class: 'Meat', score: 0.87, bbox: [0, 0, 0, 0] },
          { class: 'Nuts', score: 0.93, bbox: [0, 0, 0, 0] }
        ];

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        onDetectionComplete(predefinedObjects);
      } catch (err) {
        setError('Error detecting objects in the image');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    simulateDetection();
  }, [imageUrl, onDetectionComplete]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Uploaded image"
        className="max-w-full h-auto rounded-lg"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;