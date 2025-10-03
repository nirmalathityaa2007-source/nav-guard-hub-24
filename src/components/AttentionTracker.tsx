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

// Advanced attention detection metrics
interface AttentionMetrics {
  faceDetected: boolean;
  eyeAspectRatio: { left: number; right: number };
  gazeDirection: { horizontal: number; vertical: number };
  headPose: { yaw: number; pitch: number; roll: number };
  blinkRate: number;
  movementStability: number;
  eyesOpenDuration: number;
  lookingAtScreenConfidence: number;
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
  const [lastDetectionData, setLastDetectionData] = useState<AttentionMetrics | null>(null);
  const animationRef = useRef<number>();
  const captureIntervalRef = useRef<number>();
  
  // Advanced tracking state
  const blinkHistoryRef = useRef<number[]>([]);
  const headPoseHistoryRef = useRef<{yaw: number; pitch: number; timestamp: number}[]>([]);
  const gazeHistoryRef = useRef<{h: number; v: number; timestamp: number}[]>([]);
  const eyesOpenTimeRef = useRef<number>(Date.now());
  const lastBlinkTimeRef = useRef<number>(Date.now());
  const attentionHistoryRef = useRef<number[]>([]);

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
      
      // Start frame capture interval (every 2 seconds for more responsive tracking)
      captureIntervalRef.current = window.setInterval(() => {
        captureAndAnalyzeFrame();
      }, 2000);
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
        // Keep backend scoring for persistence only; UI uses local real-time score
        // You can log or extend this if needed
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
        setIsLookingAtScreen(detectionData.lookingAtScreenConfidence > 0.6);
        
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
        const emptyMetrics: AttentionMetrics = {
          faceDetected: false,
          eyeAspectRatio: { left: 0, right: 0 },
          gazeDirection: { horizontal: 0, vertical: 0 },
          headPose: { yaw: 0, pitch: 0, roll: 0 },
          blinkRate: 0,
          movementStability: 0,
          eyesOpenDuration: 0,
          lookingAtScreenConfidence: 0
        };
        setLastDetectionData(emptyMetrics);
        setAttentionScore(0);
        onAttentionUpdate?.(0);
        setIsLookingAtScreen(false);
      }
    } catch (error) {
      console.error('Error in face detection:', error);
    }

    animationRef.current = requestAnimationFrame(detectFaces);
  };

  const calculateEyeAspectRatio = (eyePoints: any[], keypoints: any[]) => {
    // Calculate Eye Aspect Ratio (EAR) for blink detection
    // EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
    const p1 = keypoints[eyePoints[0]];
    const p2 = keypoints[eyePoints[1]];
    const p3 = keypoints[eyePoints[2]];
    const p4 = keypoints[eyePoints[3]];
    const p5 = keypoints[eyePoints[4]];
    const p6 = keypoints[eyePoints[5]];
    
    const vertical1 = Math.hypot(p2.x - p6.x, p2.y - p6.y);
    const vertical2 = Math.hypot(p3.x - p5.x, p3.y - p5.y);
    const horizontal = Math.hypot(p1.x - p4.x, p1.y - p4.y);
    
    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  const calculateGazeDirection = (eyeCenter: any, iris: any) => {
    // Calculate gaze direction based on iris position relative to eye center
    const dx = iris.x - eyeCenter.x;
    const dy = iris.y - eyeCenter.y;
    return { horizontal: dx, vertical: dy };
  };

  const calculateHeadPose = (keypoints: any[]) => {
    // Advanced head pose estimation using facial landmarks
    const nose = keypoints[1];
    const leftEye = keypoints[33];
    const rightEye = keypoints[263];
    const leftMouth = keypoints[61];
    const rightMouth = keypoints[291];
    const chin = keypoints[199];
    const forehead = keypoints[10];
    
    // Yaw (left-right rotation)
    const faceWidth = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
    const noseOffset = nose.x - (leftEye.x + rightEye.x) / 2;
    const yaw = (noseOffset / faceWidth) * 90;
    
    // Pitch (up-down rotation)
    const faceHeight = Math.hypot(forehead.x - chin.x, forehead.y - chin.y);
    const noseVerticalOffset = nose.y - forehead.y;
    const pitch = ((noseVerticalOffset / faceHeight) - 0.5) * 60;
    
    // Roll (tilt)
    const eyeAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    const roll = eyeAngle * (180 / Math.PI);
    
    return { yaw, pitch, roll };
  };

  const calculateMovementStability = () => {
    // Analyze recent head pose history for stability
    const recentPoses = headPoseHistoryRef.current.slice(-10);
    if (recentPoses.length < 5) return 1.0;
    
    const yawVariance = recentPoses.reduce((sum, pose, i) => {
      if (i === 0) return 0;
      return sum + Math.abs(pose.yaw - recentPoses[i-1].yaw);
    }, 0) / recentPoses.length;
    
    const pitchVariance = recentPoses.reduce((sum, pose, i) => {
      if (i === 0) return 0;
      return sum + Math.abs(pose.pitch - recentPoses[i-1].pitch);
    }, 0) / recentPoses.length;
    
    const totalVariance = yawVariance + pitchVariance;
    return Math.max(0, 1 - (totalVariance / 30));
  };

  const calculateBlinkRate = () => {
    const now = Date.now();
    const recentBlinks = blinkHistoryRef.current.filter(time => now - time < 60000);
    return recentBlinks.length; // blinks per minute
  };

  const calculateDetectionData = (face: any): AttentionMetrics => {
    if (!face.keypoints || face.keypoints.length === 0) {
      return {
        faceDetected: false,
        eyeAspectRatio: { left: 0, right: 0 },
        gazeDirection: { horizontal: 0, vertical: 0 },
        headPose: { yaw: 0, pitch: 0, roll: 0 },
        blinkRate: 0,
        movementStability: 0,
        eyesOpenDuration: 0,
        lookingAtScreenConfidence: 0
      };
    }

    const keypoints = face.keypoints;
    const now = Date.now();
    
    // Calculate Eye Aspect Ratios
    const leftEyePoints = [33, 160, 158, 133, 153, 144]; // Left eye landmarks
    const rightEyePoints = [362, 385, 387, 263, 373, 380]; // Right eye landmarks
    const leftEAR = calculateEyeAspectRatio(leftEyePoints, keypoints);
    const rightEAR = calculateEyeAspectRatio(rightEyePoints, keypoints);
    
    // Blink detection (EAR < 0.15 indicates closed eyes)
    const eyesOpen = leftEAR > 0.15 && rightEAR > 0.15;
    if (!eyesOpen && now - lastBlinkTimeRef.current > 200) {
      blinkHistoryRef.current.push(now);
      lastBlinkTimeRef.current = now;
      eyesOpenTimeRef.current = now;
    }
    
    const eyesOpenDuration = eyesOpen ? (now - eyesOpenTimeRef.current) / 1000 : 0;
    
    // Simplified gaze direction placeholder (driven by head pose + stability)
    const avgGaze = { horizontal: 0, vertical: 0 };
    // Store gaze history for stability reference
    gazeHistoryRef.current.push({ h: avgGaze.horizontal, v: avgGaze.vertical, timestamp: now });
    if (gazeHistoryRef.current.length > 30) gazeHistoryRef.current.shift();
    
    // Calculate head pose
    const headPose = calculateHeadPose(keypoints);
    headPoseHistoryRef.current.push({ yaw: headPose.yaw, pitch: headPose.pitch, timestamp: now });
    if (headPoseHistoryRef.current.length > 20) headPoseHistoryRef.current.shift();
    
    // Calculate movement stability
    const movementStability = calculateMovementStability();
    
    // Calculate blink rate
    const blinkRate = calculateBlinkRate();
    
    // Looking at screen confidence driven by head pose + stability
    const yawFactor = Math.max(0, 1 - Math.abs(headPose.yaw) / 30);
    const pitchFactor = Math.max(0, 1 - Math.abs(headPose.pitch) / 20);
    const stabilityFactor = Math.max(0, Math.min(1, movementStability));
    const lookingAtScreenConfidence = 0.5 * yawFactor + 0.3 * pitchFactor + 0.2 * stabilityFactor;
    
    return {
      faceDetected: true,
      eyeAspectRatio: { left: leftEAR, right: rightEAR },
      gazeDirection: avgGaze,
      headPose,
      blinkRate,
      movementStability,
      eyesOpenDuration,
      lookingAtScreenConfidence
    };
  };

  const calculateLocalAttentionScore = (metrics: AttentionMetrics): number => {
    if (!metrics.faceDetected) return 0;
    
    const { eyeAspectRatio, headPose, blinkRate, movementStability, eyesOpenDuration, lookingAtScreenConfidence } = metrics;
    
    // Eyes closed = 0 attention
    if (eyeAspectRatio.left < 0.15 && eyeAspectRatio.right < 0.15) return 0;
    
    // Multiple weighted factors for accurate scoring
    let score = 0;
    
    // Looking at screen confidence (40% weight)
    score += lookingAtScreenConfidence * 40;
    
    // Head pose (20% weight)
    const headPoseScore = Math.max(0, 1 - (Math.abs(headPose.yaw) / 45) - (Math.abs(headPose.pitch) / 30));
    score += headPoseScore * 20;
    
    // Movement stability (15% weight)
    score += movementStability * 15;
    
    // Blink rate (10% weight) - normal is 12-20 blinks/min
    const blinkScore = blinkRate >= 10 && blinkRate <= 25 ? 1.0 : 0.5;
    score += blinkScore * 10;
    
    // Eyes open duration (15% weight) - sustained attention
    const durationScore = Math.min(1.0, eyesOpenDuration / 30);
    score += durationScore * 15;
    
    // Store in history for smoothing
    attentionHistoryRef.current.push(score);
    if (attentionHistoryRef.current.length > 10) attentionHistoryRef.current.shift();
    
    // Apply moving average for smooth scores
    const smoothedScore = attentionHistoryRef.current.reduce((a, b) => a + b, 0) / attentionHistoryRef.current.length;
    
    return Math.round(Math.max(0, Math.min(100, smoothedScore)));
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