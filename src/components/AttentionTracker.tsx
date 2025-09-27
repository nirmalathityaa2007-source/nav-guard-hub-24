import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, Camera, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AttentionTrackerProps {
  isActive: boolean;
  onAttentionUpdate?: (score: number) => void;
  onFaceDetected?: (detected: boolean) => void;
}

const AttentionTracker: React.FC<AttentionTrackerProps> = ({
  isActive,
  onAttentionUpdate,
  onFaceDetected
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceModel, setFaceModel] = useState<any>(null);
  const [landmarkModel, setLandmarkModel] = useState<any>(null);
  const [attentionScore, setAttentionScore] = useState(85);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isLookingAtScreen, setIsLookingAtScreen] = useState(true);
  const [eyeMovementData, setEyeMovementData] = useState<number[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading AI models...');
        await tf.ready();
        
        // Load BlazeFace model for face detection
        const blazeFaceModel = await blazeface.load();
        setFaceModel(blazeFaceModel);
        
        // Load MediaPipe FaceMesh for detailed landmarks
        const landmarkDetector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: 'tfjs',
            maxFaces: 1,
            refineLandmarks: true
          }
        );
        setLandmarkModel(landmarkDetector);
        
        console.log('AI models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (isActive && faceModel && landmarkModel) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, faceModel, landmarkModel]);

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

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || !faceModel || !landmarkModel) {
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

      if (detected) {
        // Get detailed landmarks
        const landmarks = await landmarkModel.estimateFaces(video);
        
        if (landmarks.length > 0) {
          const face = landmarks[0];
          const attention = calculateAttentionScore(face);
          setAttentionScore(attention);
          onAttentionUpdate?.(attention);

          // Draw face detection box
          const bbox = faces[0];
          ctx.strokeStyle = attention > 60 ? '#22c55e' : '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            bbox.topLeft[0],
            bbox.topLeft[1],
            bbox.bottomRight[0] - bbox.topLeft[0],
            bbox.bottomRight[1] - bbox.topLeft[1]
          );

          // Draw attention score
          ctx.fillStyle = attention > 60 ? '#22c55e' : '#ef4444';
          ctx.font = '16px sans-serif';
          ctx.fillText(
            `Attention: ${attention}%`,
            bbox.topLeft[0],
            bbox.topLeft[1] - 10
          );
        }
      }
    } catch (error) {
      console.error('Error in face detection:', error);
    }

    animationRef.current = requestAnimationFrame(detectFaces);
  };

  const calculateAttentionScore = (face: any): number => {
    try {
      if (!face.keypoints || face.keypoints.length === 0) {
        return attentionScore;
      }

      // Get eye landmarks (MediaPipe FaceMesh indices)
      const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
      const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
      
      const leftEyePoints = leftEyeIndices.map(i => face.keypoints[i]).filter(Boolean);
      const rightEyePoints = rightEyeIndices.map(i => face.keypoints[i]).filter(Boolean);

      if (leftEyePoints.length === 0 || rightEyePoints.length === 0) {
        return attentionScore;
      }

      // Calculate eye aspect ratio (EAR) - measure of eye openness
      const leftEAR = calculateEAR(leftEyePoints);
      const rightEAR = calculateEAR(rightEyePoints);
      const avgEAR = (leftEAR + rightEAR) / 2;

      // Calculate head pose - looking at screen vs looking away
      const nose = face.keypoints[1]; // Nose tip
      const leftEyeCenter = getCenterPoint(leftEyePoints);
      const rightEyeCenter = getCenterPoint(rightEyePoints);
      
      if (!nose || !leftEyeCenter || !rightEyeCenter) {
        return attentionScore;
      }

      // Calculate head rotation based on eye positions relative to nose
      const eyeDistance = Math.abs(leftEyeCenter.x - rightEyeCenter.x);
      const headRotation = Math.abs((leftEyeCenter.x + rightEyeCenter.x) / 2 - nose.x) / eyeDistance;

      // Calculate attention score based on multiple factors
      let score = 100;

      // Eye openness factor (0-40 points)
      if (avgEAR < 0.15) { // Eyes likely closed
        score -= 40;
      } else if (avgEAR < 0.2) { // Eyes partially closed
        score -= 20;
      }

      // Head pose factor (0-30 points)
      if (headRotation > 0.3) { // Head turned away significantly
        score -= 30;
        setIsLookingAtScreen(false);
      } else if (headRotation > 0.15) { // Head slightly turned
        score -= 15;
        setIsLookingAtScreen(true);
      } else {
        setIsLookingAtScreen(true);
      }

      // Movement stability factor (0-30 points)
      const currentMovement = Math.abs(nose.x - (face.keypoints[0]?.x || nose.x));
      setEyeMovementData(prev => {
        const newData = [...prev, currentMovement].slice(-10); // Keep last 10 readings
        const avgMovement = newData.reduce((a, b) => a + b, 0) / newData.length;
        
        if (avgMovement > 20) { // High movement - distracted
          score -= 30;
        } else if (avgMovement > 10) { // Moderate movement
          score -= 15;
        }
        
        return newData;
      });

      // Ensure score is within bounds
      return Math.max(0, Math.min(100, Math.round(score)));

    } catch (error) {
      console.error('Error calculating attention score:', error);
      return attentionScore;
    }
  };

  const calculateEAR = (eyePoints: any[]): number => {
    if (eyePoints.length < 6) return 0.2; // Default EAR
    
    try {
      // Calculate vertical distances
      const p2 = eyePoints[1] || eyePoints[0];
      const p6 = eyePoints[5] || eyePoints[eyePoints.length - 1];
      const p3 = eyePoints[2] || eyePoints[1];
      const p5 = eyePoints[4] || eyePoints[eyePoints.length - 2];
      
      const p1 = eyePoints[0];
      const p4 = eyePoints[3] || eyePoints[Math.floor(eyePoints.length / 2)];
      
      const vertical1 = Math.sqrt(Math.pow(p2.x - p6.x, 2) + Math.pow(p2.y - p6.y, 2));
      const vertical2 = Math.sqrt(Math.pow(p3.x - p5.x, 2) + Math.pow(p3.y - p5.y, 2));
      const horizontal = Math.sqrt(Math.pow(p1.x - p4.x, 2) + Math.pow(p1.y - p4.y, 2));
      
      return (vertical1 + vertical2) / (2 * horizontal);
    } catch (error) {
      return 0.2; // Default fallback
    }
  };

  const getCenterPoint = (points: any[]) => {
    if (points.length === 0) return null;
    const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    return { x, y };
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
          {!isActive && (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <p>Attention tracking inactive</p>
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