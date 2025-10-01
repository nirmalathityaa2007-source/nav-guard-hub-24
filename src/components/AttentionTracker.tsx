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
  const [facePositionHistory, setFacePositionHistory] = useState<{x: number, y: number, size: number, timestamp: number}[]>([]);
  const [eyesClosedStart, setEyesClosedStart] = useState<number | null>(null);
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
      } else {
        // No face detected → Attention = 0
        setAttentionScore(0);
        onAttentionUpdate?.(0);
        setIsLookingAtScreen(false);
      }
    } catch (error) {
      console.error('Error in face detection:', error);
    }

    animationRef.current = requestAnimationFrame(detectFaces);
  };

  const calculateAttentionScore = (face: any): number => {
    try {
      if (!face.topLeft || !face.bottomRight) {
        return 0;
      }

      const now = Date.now();

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
        const newHistory = [...prev, { x: faceCenter.x, y: faceCenter.y, size: faceSize, timestamp: now }].slice(-60);
        return newHistory;
      });

      // 1. Check for eyes closed (using face size as proxy - smaller face = possibly eyes closed or looking away)
      const probability = face.probability?.[0] || 1;
      if (probability < 0.7) {
        if (!eyesClosedStart) {
          setEyesClosedStart(now);
        } else if (now - eyesClosedStart > 5000) {
          // Eyes closed for more than 5 seconds → Attention = 10
          setIsLookingAtScreen(false);
          return 10;
        }
      } else {
        setEyesClosedStart(null);
      }

      // 2. Check for head movements (need sufficient history)
      if (facePositionHistory.length >= 30) {
        const recentPositions = facePositionHistory.slice(-30);
        
        // Calculate horizontal movement (left-right shaking)
        const xMovements = [];
        for (let i = 1; i < recentPositions.length; i++) {
          xMovements.push(recentPositions[i].x - recentPositions[i-1].x);
        }
        
        // Calculate vertical movement (up-down nodding)
        const yMovements = [];
        for (let i = 1; i < recentPositions.length; i++) {
          yMovements.push(recentPositions[i].y - recentPositions[i-1].y);
        }
        
        // Count direction changes for movement detection
        let xDirectionChanges = 0;
        let xTotalMovement = 0;
        for (let i = 1; i < xMovements.length; i++) {
          if (Math.abs(xMovements[i]) > 2) { // Only count significant movements
            xTotalMovement += Math.abs(xMovements[i]);
            if ((xMovements[i] > 0) !== (xMovements[i-1] > 0)) {
              xDirectionChanges++;
            }
          }
        }
        
        let yDirectionChanges = 0;
        let yTotalMovement = 0;
        for (let i = 1; i < yMovements.length; i++) {
          if (Math.abs(yMovements[i]) > 2) { // Only count significant movements
            yTotalMovement += Math.abs(yMovements[i]);
            if ((yMovements[i] > 0) !== (yMovements[i-1] > 0)) {
              yDirectionChanges++;
            }
          }
        }
        
        // Head shaking left and right → Attention = 50
        // Must have multiple direction changes AND significant total movement
        if (xDirectionChanges >= 4 && xTotalMovement > 50) {
          setIsLookingAtScreen(false);
          return 50;
        }
        
        // Head moving down and up → Attention = 30
        // Must have multiple direction changes AND significant total movement
        if (yDirectionChanges >= 4 && yTotalMovement > 50) {
          setIsLookingAtScreen(false);
          return 30;
        }
      }

      // 3. Check if face is straight, centered, and visible → Attention = 100
      const videoWidth = videoRef.current?.videoWidth || 640;
      const videoHeight = videoRef.current?.videoHeight || 480;
      const centerX = videoWidth / 2;
      const centerY = videoHeight / 2;
      
      const centerDistance = Math.sqrt(
        Math.pow(faceCenter.x - centerX, 2) + Math.pow(faceCenter.y - centerY, 2)
      );
      
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const centeringRatio = centerDistance / maxDistance;
      
      // Face aspect ratio check (not tilted)
      const aspectRatio = faceWidth / faceHeight;
      const isStraight = aspectRatio >= 0.75 && aspectRatio <= 1.25;
      
      // Face is straight, centered, and clearly visible → Attention = 100
      if (centeringRatio <= 0.3 && isStraight && probability > 0.75) {
        setIsLookingAtScreen(true);
        return 100;
      }

      // Default: face detected but not perfectly attentive
      setIsLookingAtScreen(false);
      return 70;

    } catch (error) {
      console.error('Error calculating attention score:', error);
      return 0;
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
            className="w-full aspect-video bg-background rounded-lg object-cover border"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full aspect-video rounded-lg"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          {(!isActive || (isInLiveClass && !externalVideoStream)) && (
            <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border">
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