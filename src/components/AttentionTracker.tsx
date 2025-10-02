import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, Camera, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface AttentionTrackerProps {
  isActive: boolean;
  isInLiveClass?: boolean;
  externalVideoStream?: MediaStream | null;
  onAttentionUpdate?: (score: number) => void;
  onFaceDetected?: (detected: boolean) => void;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
}

const AttentionTracker: React.FC<AttentionTrackerProps> = ({
  isActive,
  isInLiveClass = false,
  externalVideoStream = null,
  onAttentionUpdate,
  onFaceDetected,
  studentId = 'demo-student',
  studentName = 'Student',
  studentAvatar
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
  const [lastDetectionData, setLastDetectionData] = useState<any>(null);
  const animationRef = useRef<number>();
  const captureIntervalRef = useRef<number>();

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
        useExternalStream();
      } else if (!isInLiveClass) {
        startCamera();
      } else {
        stopCamera();
      }
      
      // Start frame capture interval (every 2.5 seconds)
      captureIntervalRef.current = window.setInterval(() => {
        captureAndAnalyzeFrame();
      }, 2500);
    } else {
      stopCamera();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
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
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
  };

  const captureAndAnalyzeFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0) return;

    // Capture frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const frameData = canvas.toDataURL('image/jpeg', 0.8);

    try {
      // Send to backend for analysis
      const response = await supabase.functions.invoke('analyze-attention', {
        body: {
          studentId,
          frameData,
          detectionData: lastDetectionData
        }
      });

      if (response.data?.attention_score !== undefined) {
        const score = response.data.attention_score;
        setAttentionScore(score);
        onAttentionUpdate?.(score);
      }
    } catch (error) {
      console.error('Error analyzing frame:', error);
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
        const detectionData = calculateDetectionData(faces[0]);
        setLastDetectionData(detectionData);
        
        // Update local score for immediate feedback
        const localScore = calculateLocalAttentionScore(detectionData);
        setAttentionScore(localScore);
        onAttentionUpdate?.(localScore);

        // Draw face mesh points
        const keypoints = faces[0].keypoints;
        ctx.fillStyle = localScore > 60 ? '#22c55e' : '#ef4444';
        
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
          `Attention: ${localScore}%`,
          20,
          30
        );
      } else {
        setLastDetectionData({ faceDetected: false });
        setAttentionScore(0);
        onAttentionUpdate?.(0);
        setIsLookingAtScreen(false);
      }
    } catch (error) {
      console.error('Error in face detection:', error);
    }

    animationRef.current = requestAnimationFrame(detectFaces);
  };

  const calculateDetectionData = (face: any) => {
    if (!face.keypoints || face.keypoints.length === 0) {
      return { faceDetected: false };
    }

    const keypoints = face.keypoints;
    const leftEyeHeight = Math.abs(keypoints[159].y - keypoints[145].y);
    const rightEyeHeight = Math.abs(keypoints[386].y - keypoints[374].y);
    const avgEyeOpen = (leftEyeHeight + rightEyeHeight) / 2;

    const nose = keypoints[1];
    const leftEar = keypoints[234];
    const rightEar = keypoints[454];
    const yaw = rightEar.x - leftEar.x;
    const pitch = nose.y - ((leftEar.y + rightEar.y) / 2);

    const eyesOpen = avgEyeOpen >= 0.01;
    const lookingAtScreen = Math.abs(yaw) < 60 && Math.abs(pitch) < 20;

    return {
      faceDetected: true,
      eyesOpen,
      yaw,
      pitch,
      lookingAtScreen
    };
  };

  const calculateLocalAttentionScore = (detectionData: any): number => {
    if (!detectionData.faceDetected) return 0;
    if (!detectionData.eyesOpen) return 0;
    if (detectionData.lookingAtScreen) return 100;
    if (Math.abs(detectionData.yaw) > 45 || Math.abs(detectionData.pitch) > 30) return 50;
    return 70;
  };


  const getAttentionColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAttentionStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Moderate';
    return 'Poor';
  };

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              {studentAvatar ? (
                <AvatarImage src={studentAvatar} alt={studentName} />
              ) : (
                <AvatarFallback className="bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {studentName}
                {faceDetected ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-red-300 text-red-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    No Face
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Real-time Attention Monitoring</p>
            </div>
          </div>
          <Eye className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Video Preview */}
        <div className="relative rounded-xl overflow-hidden shadow-md">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-video bg-background object-cover"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full aspect-video"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          {(!isActive || (isInLiveClass && !externalVideoStream)) && (
            <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground font-medium">
                  {isInLiveClass && !externalVideoStream
                    ? "Waiting for live class video stream..." 
                    : "Attention tracking inactive"
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Attention Score Display */}
        <div className="bg-gradient-to-br from-background to-muted/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Attention Score
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-bold ${
                attentionScore >= 80 ? 'text-green-600' : 
                attentionScore >= 50 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {attentionScore}%
              </span>
              <Badge variant="outline" className="font-semibold">
                {getAttentionStatus(attentionScore)}
              </Badge>
            </div>
          </div>
          
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getAttentionColor(attentionScore)}`}
              style={{ width: `${attentionScore}%` }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg border-2 transition-colors ${
            faceDetected 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Face Detected</span>
              <Badge variant={faceDetected ? "default" : "destructive"} className="font-semibold">
                {faceDetected ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
          <div className={`p-3 rounded-lg border-2 transition-colors ${
            isLookingAtScreen 
              ? 'border-blue-200 bg-blue-50' 
              : 'border-orange-200 bg-orange-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">On Screen</span>
              <Badge variant={isLookingAtScreen ? "default" : "secondary"} className="font-semibold">
                {isLookingAtScreen ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttentionTracker;