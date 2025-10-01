import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
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
  const [eyesClosedStart, setEyesClosedStart] = useState<number | null>(null);
  const [headShakeHistory, setHeadShakeHistory] = useState<{yaw: number, timestamp: number}[]>([]);
  const [headNodHistory, setHeadNodHistory] = useState<{pitch: number, timestamp: number}[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading MediaPipe FaceMesh model...');
        await tf.ready();
        
        // Load MediaPipe FaceMesh model for face landmarks detection
        const detector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          { 
            runtime: 'tfjs',
            refineLandmarks: true
          }
        );
        setFaceModel(detector);
        
        console.log('MediaPipe FaceMesh model loaded successfully');
      } catch (error) {
        console.error('Error loading MediaPipe FaceMesh model:', error);
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
      // Detect faces with MediaPipe FaceMesh
      const faces = await faceModel.estimateFaces(video);
      const detected = faces.length > 0;
      
      setFaceDetected(detected);
      onFaceDetected?.(detected);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (detected && faces[0]) {
        const attention = calculateAttentionScore(faces[0]);
        setAttentionScore(attention);
        onAttentionUpdate?.(attention);

        // Draw face mesh points
        const keypoints = faces[0].keypoints;
        ctx.fillStyle = attention > 60 ? '#22c55e' : '#ef4444';
        
        // Draw key facial landmarks
        [1, 159, 386, 234, 454].forEach(idx => {
          if (keypoints[idx]) {
            ctx.beginPath();
            ctx.arc(keypoints[idx].x, keypoints[idx].y, 3, 0, 2 * Math.PI);
            ctx.fill();
          }
        });

        // Draw attention score
        ctx.font = '16px sans-serif';
        ctx.fillText(
          `Attention: ${attention}%`,
          20,
          30
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
      if (!face.keypoints || face.keypoints.length === 0) {
        return 0;
      }

      const now = Date.now();
      const keypoints = face.keypoints;

      // Calculate Eye Aspect Ratio (EAR) for both eyes
      const leftEyeHeight = Math.abs(keypoints[159].y - keypoints[145].y);
      const rightEyeHeight = Math.abs(keypoints[386].y - keypoints[374].y);
      const avgEyeOpen = (leftEyeHeight + rightEyeHeight) / 2;

      // 1. Check for eyes closed for more than 5 seconds → Attention = 10
      if (avgEyeOpen < 0.01) {
        if (!eyesClosedStart) {
          setEyesClosedStart(now);
        } else if (now - eyesClosedStart > 5000) {
          setIsLookingAtScreen(false);
          return 10;
        }
      } else {
        setEyesClosedStart(null);
      }

      // Calculate head pose (yaw and pitch)
      const nose = keypoints[1]; // Nose tip
      const leftEar = keypoints[234];
      const rightEar = keypoints[454];
      
      // Yaw (left-right rotation)
      const yaw = rightEar.x - leftEar.x;
      
      // Pitch (up-down rotation)
      const pitch = nose.y - ((leftEar.y + rightEar.y) / 2);

      // Track yaw for head shaking detection
      setHeadShakeHistory(prev => {
        const newHistory = [...prev, { yaw, timestamp: now }].slice(-30);
        return newHistory;
      });

      // Track pitch for head nodding detection
      setHeadNodHistory(prev => {
        const newHistory = [...prev, { pitch, timestamp: now }].slice(-30);
        return newHistory;
      });

      // 2. Check for head shaking left and right → Attention = 50
      if (headShakeHistory.length >= 20) {
        const yawChanges = headShakeHistory.slice(-20);
        let directionChanges = 0;
        
        for (let i = 1; i < yawChanges.length; i++) {
          const prev = yawChanges[i-1].yaw;
          const curr = yawChanges[i].yaw;
          if ((curr > 0) !== (prev > 0)) {
            directionChanges++;
          }
        }
        
        if (directionChanges >= 4 && Math.abs(yaw) > 60) {
          setIsLookingAtScreen(false);
          return 50;
        }
      }

      // 3. Check for head nodding up and down → Attention = 30
      if (headNodHistory.length >= 20) {
        const pitchChanges = headNodHistory.slice(-20);
        let directionChanges = 0;
        
        for (let i = 1; i < pitchChanges.length; i++) {
          const prev = pitchChanges[i-1].pitch;
          const curr = pitchChanges[i].pitch;
          if ((curr > 0) !== (prev > 0)) {
            directionChanges++;
          }
        }
        
        if (directionChanges >= 4 && Math.abs(pitch) > 20) {
          setIsLookingAtScreen(false);
          return 30;
        }
      }

      // 4. Face is straight and visible → Attention = 100
      if (Math.abs(yaw) < 60 && Math.abs(pitch) < 20 && avgEyeOpen >= 0.01) {
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