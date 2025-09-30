import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import JitsiMeetStable from './JitsiMeetStable';
import AttentionTracker from './AttentionTracker';
import { Video, Users, Eye, Clock, TrendingUp, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface LiveClassManagerProps {
  userRole: 'student' | 'faculty' | 'admin';
  userName: string;
  roomName?: string;
  className?: string;
}

const LiveClassManager: React.FC<LiveClassManagerProps> = ({
  userRole,
  userName,
  roomName = 'live-class-room',
  className = 'Current Class'
}) => {
  const [isInClass, setIsInClass] = useState(false);
  const [attentionScore, setAttentionScore] = useState(85);
  const [faceDetected, setFaceDetected] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [classStartTime] = useState(new Date());
  const [currentRoomId, setCurrentRoomId] = useState<string>('');
  const [copiedRoomId, setCopiedRoomId] = useState(false);

  // Generate unique room ID for faculty or load existing room for students
  useEffect(() => {
    if (userRole === 'faculty') {
      // Faculty generates a new room ID
      const roomId = `class-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setCurrentRoomId(roomId);
      // Store room ID for students to access
      localStorage.setItem('activeClassRoom', roomId);
      localStorage.setItem('activeClassName', className);
      localStorage.setItem('activeClassTeacher', userName);
    } else {
      // Students load the active room ID
      const activeRoom = localStorage.getItem('activeClassRoom');
      if (activeRoom) {
        setCurrentRoomId(activeRoom);
      }
    }
  }, [userRole, className, userName]);

  const handleJoinClass = useCallback(() => {
    setIsInClass(true);
  }, []);

  const handleLeaveClass = useCallback(() => {
    setIsInClass(false);
    setVideoStream(null);
  }, []);

  const handleVideoStreamReady = useCallback((stream: MediaStream) => {
    console.log('Video stream ready for attention tracking');
    setVideoStream(stream);
  }, []);

  const handleAttentionUpdate = useCallback((score: number) => {
    setAttentionScore(score);
  }, []);

  const handleFaceDetected = useCallback((detected: boolean) => {
    setFaceDetected(detected);
  }, []);

  const getClassDuration = () => {
    const now = new Date();
    const duration = Math.floor((now.getTime() - classStartTime.getTime()) / 1000 / 60);
    return duration > 0 ? `${duration} min` : '0 min';
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoomId);
    setCopiedRoomId(true);
    toast.success('Room ID copied to clipboard');
    setTimeout(() => setCopiedRoomId(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Class Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              {className}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isInClass ? "default" : "outline"} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isInClass ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {isInClass ? 'In Class' : 'Not Connected'}
              </Badge>
              {isInClass && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getClassDuration()}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {currentRoomId && (
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {userRole === 'faculty' ? 'Share this Room ID with students:' : 'Current Room ID:'}
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={currentRoomId} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={copyRoomId}
                  >
                    {copiedRoomId ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live Class Video */}
        <div className="lg:col-span-2">
          {currentRoomId ? (
            <JitsiMeetStable
              roomName={currentRoomId}
              displayName={userName}
              userRole={userRole}
              onJoinMeeting={handleJoinClass}
              onLeaveMeeting={handleLeaveClass}
              onVideoStreamReady={handleVideoStreamReady}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[500px]">
                <div className="text-center text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Waiting for teacher to start the class...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Attention Tracking & Stats */}
        <div className="space-y-4">
          {userRole === 'student' && isInClass && (
            <AttentionTracker
              isActive={true}
              isInLiveClass={true}
              externalVideoStream={videoStream}
              onAttentionUpdate={handleAttentionUpdate}
              onFaceDetected={handleFaceDetected}
            />
          )}

          {/* Live Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Live Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userRole === 'student' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Attention Score</span>
                    <Badge variant={attentionScore > 70 ? "default" : "secondary"}>
                      {attentionScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Face Detected</span>
                    <Badge variant={faceDetected ? "default" : "outline"}>
                      {faceDetected ? "Yes" : "No"}
                    </Badge>
                  </div>
                </>
              )}
              
              {userRole === 'faculty' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Students Online</span>
                    <Badge variant="default">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg. Attention</span>
                    <Badge variant="default">78%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Cameras</span>
                    <Badge variant="default">11/12</Badge>
                  </div>
                </>
              )}

              {isInClass && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Class started: {classStartTime.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role-specific Actions */}
          {userRole === 'faculty' && isInClass && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Class Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  View All Students
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Attention Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClassManager;