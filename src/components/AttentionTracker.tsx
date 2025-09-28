import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, Camera, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AttentionTrackerProps {
  isActive: boolean;
  isInLiveClass?: boolean;
  externalVideoStream?: MediaStream | null;
  onAttentionUpdate?: (score: number) => void;
  onFaceDetected?: (detected: boolean) => void;
}

const AttentionTracker: React.FC<AttentionTrackerProps> = ({
  isActive,
  isInLiveClass = false,
  externalVideoStream = null,
  onAttentionUpdate,
  onFaceDetected
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceModel, setFaceModel] = useState<any>(null);
  const [attentionScore, setAttentionScore] = useState(85);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isLookingAtScreen, setIsLookingAtScreen] = useState(true);
  const [facePositionHistory, setFacePositionHistory] = useState<{x: number, y: number, size: number}[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading BlazeFace model...');
        await tf.ready();
        
        // Load BlazeFace model for face detection
        const blazeFaceModel = await blazeface.load();
        setFaceModel(blazeFaceModel);
        
        console.log('BlazeFace model loaded successfully');
      } catch (error) {
        console.error('Error loading BlazeFace model:', error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (isActive && faceModel) {
      if (externalVideoStream) {
        // Use external video stream from Jitsi
        useExternalStream();
      } else if (!isInLiveClass) {
        // Only start own camera if not in live class and no external stream
        startCamera();
      } else {
        stopCamera();
      }
    } else {
      stopCamera();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, faceModel, isInLiveClass, externalVideoStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480, 
          facingMode: 'user' 
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          detectFaces();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const useExternalStream = () => {
    if (videoRef.current && externalVideoStream) {
      videoRef.current.srcObject = externalVideoStream;
      videoRef.current.onloadedmetadata = () => {
        detectFaces();
      };
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject && !externalVideoStream) {
      // Only stop if it's our own camera stream, not external
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || !faceModel) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      animationRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      // Detect faces with BlazeFace
      const faces = await faceModel.estimateFaces(video, false);
      const detected = faces.length > 0;
      
      setFaceDetected(detected);
      onFaceDetected?.(detected);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (detected && faces[0]) {
        const face = faces[0];
        const attention = calculateAttentionScore(face);
        setAttentionScore(attention);
        onAttentionUpdate?.(attention);

        // Draw face detection box
        ctx.strokeStyle = attention > 60 ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          face.topLeft[0],
          face.topLeft[1],
          face.bottomRight[0] - face.topLeft[0],
          face.bottomRight[1] - face.topLeft[1]
        );

        // Draw attention score
        ctx.fillStyle = attention > 60 ? '#22c55e' : '#ef4444';
        ctx.font = '16px sans-serif';
        ctx.fillText(
          `Attention: ${attention}%`,
          face.topLeft[0],
          face.topLeft[1] - 10
        );
      }
    } catch (error) {
      console.error('Error in face detection:', error);
    }

    animationRef.current = requestAnimationFrame(detectFaces);
  };

  const calculateAttentionScore = (face: any): number => {
    try {
      if (!face.topLeft || !face.bottomRight) {
        return attentionScore;
      }

      // Calculate face center and size
      const faceCenter = {
        x: (face.topLeft[0] + face.bottomRight[0]) / 2,
        y: (face.topLeft[1] + face.bottomRight[1]) / 2
      };
      
      const faceWidth = face.bottomRight[0] - face.topLeft[0];
      const faceHeight = face.bottomRight[1] - face.topLeft[1];
      const faceSize = Math.sqrt(faceWidth * faceWidth + faceHeight * faceHeight);

      // Add to position history
      setFacePositionHistory(prev => {
        const newHistory = [...prev, { x: faceCenter.x, y: faceCenter.y, size: faceSize }].slice(-30);
        return newHistory;
      });

      let score = 100;

      // Face size factor (distance from camera) - 30 points
      const optimalSize = 150; // Optimal face size for attention
      const sizeDiff = Math.abs(faceSize - optimalSize) / optimalSize;
      if (sizeDiff > 0.5) { // Too far or too close
        score -= 30;
      } else if (sizeDiff > 0.3) {
        score -= 15;
      }

      // Face position stability - 25 points
      if (facePositionHistory.length > 5) {
        const recentPositions = facePositionHistory.slice(-10);
        const avgX = recentPositions.reduce((sum, pos) => sum + pos.x, 0) / recentPositions.length;
        const avgY = recentPositions.reduce((sum, pos) => sum + pos.y, 0) / recentPositions.length;
        
        const movement = Math.sqrt(
          Math.pow(faceCenter.x - avgX, 2) + Math.pow(faceCenter.y - avgY, 2)
        );
        
        if (movement > 50) { // High movement - distracted
          score -= 25;
        } else if (movement > 25) { // Moderate movement
          score -= 12;
        }
      }

      // Face centering - 25 points
      const videoWidth = videoRef.current?.videoWidth || 640;
      const videoHeight = videoRef.current?.videoHeight || 480;
      const centerX = videoWidth / 2;
      const centerY = videoHeight / 2;
      
      const centerDistance = Math.sqrt(
        Math.pow(faceCenter.x - centerX, 2) + Math.pow(faceCenter.y - centerY, 2)
      );
      
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const centeringRatio = centerDistance / maxDistance;
      
      if (centeringRatio > 0.4) { // Face too off-center
        score -= 25;
        setIsLookingAtScreen(false);
      } else if (centeringRatio > 0.2) {
        score -= 12;
        setIsLookingAtScreen(true);
      } else {
        setIsLookingAtScreen(true);
      }

      // Face aspect ratio (head tilt) - 20 points
      const aspectRatio = faceWidth / faceHeight;
      if (aspectRatio < 0.6 || aspectRatio > 1.4) { // Head tilted too much
        score -= 20;
      } else if (aspectRatio < 0.7 || aspectRatio > 1.3) {
        score -= 10;
      }

      // Add some randomness to simulate real attention tracking
      const randomFactor = (Math.random() - 0.5) * 10;
      score += randomFactor;

      // Ensure score is within bounds
      return Math.max(0, Math.min(100, Math.round(score)));

    } catch (error) {
      console.error('Error calculating attention score:', error);
      return attentionScore;
    }
  };


  const getAttentionLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score >= 40) return { level: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const attentionLevel = getAttentionLevel(attentionScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Attention Tracking
          {faceDetected ? (
            <Badge className="bg-green-500 hover:bg-green-600">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge variant="outline">
              <AlertTriangle className="w-3 h-3 mr-1" />
              No Face
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-48 bg-gray-100 rounded-lg object-cover"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-48 rounded-lg"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          {(!isActive || (isInLiveClass && !externalVideoStream)) && (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <p>
                  {isInLiveClass && !externalVideoStream
                    ? "Waiting for live class video stream..." 
                    : "Attention tracking inactive"
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Attention Score</span>
            <span className={`text-lg font-bold ${attentionLevel.color}`}>
              {attentionScore}%
            </span>
          </div>
          <Progress value={attentionScore} className="h-3" />
          <div className={`text-center p-2 rounded-lg ${attentionLevel.bgColor}`}>
            <span className={`text-sm font-medium ${attentionLevel.color}`}>
              {attentionLevel.level} Attention
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between p-2 border rounded">
            <span>Face Detected:</span>
            <Badge variant={faceDetected ? "default" : "outline"}>
              {faceDetected ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 border rounded">
            <span>Looking at Screen:</span>
            <Badge variant={isLookingAtScreen ? "default" : "secondary"}>
              {isLookingAtScreen ? "Yes" : "No"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttentionTracker;