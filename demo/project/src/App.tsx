import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ObjectDetection from './components/ObjectDetection';
import Navbar from './components/Navbar';
import { DetectedObject } from './types';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [uploadTimestamp, setUploadTimestamp] = useState<Date | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [status, setStatus] = useState<{
    upload: boolean;
    detection: boolean;
    storage: boolean;
  }>({
    upload: false,
    detection: false,
    storage: false,
  });

  const handleImageSelect = (file: File, timestamp: Date) => {
    const imageUrl = URL.createObjectURL(file);
    setCurrentImage(imageUrl);
    setUploadTimestamp(timestamp);
    setStatus({ ...status, upload: true });
  };

  const handleDetectionComplete = (objects: DetectedObject[]) => {
    setDetectedObjects(objects);
    setStatus({ ...status, detection: true });
    // Simulate storing to database
    setTimeout(() => {
      setStatus({ ...status, detection: true, storage: true });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Image Object Detection
            </h1>
            <p className="text-lg text-gray-600">
              Upload an image
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl">
            <ImageUploader onImageSelect={handleImageSelect} />
          </div>

          {currentImage && (
            <div className="bg-white rounded-xl shadow-xl p-8 space-y-8">
              <ObjectDetection
                imageUrl={currentImage}
                onDetectionComplete={handleDetectionComplete}
              />

              <div className="space-y-6">
                {uploadTimestamp && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      Upload time: {format(uploadTimestamp, 'PPpp')}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-gray-700 mb-3">Processing Status</h3>
                  <StatusMessage
                    isComplete={status.upload}
                    message="Successfully uploaded image"
                  />
                  <StatusMessage
                    isComplete={status.detection}
                    message="Successfully detected objects"
                  />
                  <StatusMessage
                    isComplete={status.storage}
                    message="Successfully stored detected materials"
                  />
                </div>

                {detectedObjects.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Detected Objects</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {detectedObjects.map((obj, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                        >
                          <div className="font-medium text-gray-800 capitalize">
                            {obj.class}
                          </div>
                          <div className="text-sm text-gray-500">
                            Confidence: {(obj.score * 100).toFixed(2)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const StatusMessage: React.FC<{ isComplete: boolean; message: string }> = ({
  isComplete,
  message,
}) => (
  <div className="flex items-center space-x-2">
    <CheckCircle
      className={`w-5 h-5 ${
        isComplete ? 'text-green-500' : 'text-gray-300'
      }`}
    />
    <span
      className={`text-sm ${
        isComplete ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      {message}
    </span>
  </div>
);

export default App;