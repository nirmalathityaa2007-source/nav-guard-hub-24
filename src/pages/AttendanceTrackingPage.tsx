import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Video, 
  Users, 
  Eye, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Settings,
  Play,
  Square,
  UserCheck,
  Monitor
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import JitsiMeetStable from '@/components/JitsiMeetStable';
import AttentionTracker from '@/components/AttentionTracker';

const AttendanceTrackingPage = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'faculty';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(true);
  const [focusTrackingEnabled, setFocusTrackingEnabled] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [attentionScore, setAttentionScore] = useState(85);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isInLiveClass, setIsInLiveClass] = useState(false);

  // Mock data for live tracking
  const [liveStudents, setLiveStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      rollNo: 'ST001',
      status: 'present',
      faceDetected: true,
      focusLevel: 85,
      joinTime: '09:05 AM',
      lastSeen: 'Now'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rollNo: 'ST002',
      status: 'present',
      faceDetected: true,
      focusLevel: 92,
      joinTime: '09:02 AM',
      lastSeen: 'Now'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rollNo: 'ST003',
      status: 'away',
      faceDetected: false,
      focusLevel: 15,
      joinTime: '09:10 AM',
      lastSeen: '2 min ago'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      rollNo: 'ST004',
      status: 'present',
      faceDetected: true,
      focusLevel: 78,
      joinTime: '09:00 AM',
      lastSeen: 'Now'
    }
  ]);

  const classes = [
    { id: 'math-101', name: 'Mathematics 101 - Batch A' },
    { id: 'physics-102', name: 'Physics 102 - Batch B' },
    { id: 'chem-103', name: 'Chemistry 103 - Batch A' },
  ];

  const sessionStats = {
    totalStudents: 25,
    presentStudents: 22,
    averageFocus: attentionScore,
    alerts: 3
  };

  const handleAttentionUpdate = (score: number) => {
    setAttentionScore(score);
  };

  const handleFaceDetected = (detected: boolean) => {
    setFaceDetected(detected);
  };

  const handleJoinMeeting = () => {
    setIsInLiveClass(true);
  };

  const handleLeaveMeeting = () => {
    setIsInLiveClass(false);
  };

  const getRoomName = () => {
    return selectedClass ? `class-${selectedClass}` : `class-${userRole}-${user?.name?.replace(/\s+/g, '-').toLowerCase()}`;
  };

  useEffect(() => {
    // Mock real-time updates
    const interval = setInterval(() => {
      setLiveStudents(prev => prev.map(student => ({
        ...student,
        focusLevel: Math.max(10, Math.min(100, student.focusLevel + (Math.random() - 0.5) * 10)),
        faceDetected: Math.random() > 0.1 // 90% chance of face being detected
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraEnabled(true);
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
      setCameraEnabled(false);
    }
  };

  const toggleTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      stopCamera();
    } else {
      setIsTracking(true);
      startCamera();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Present</Badge>;
      case 'away':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Away</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" />Late</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getFocusColor = (level: number) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (userRole === 'student') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Live Class</h1>
            <p className="text-muted-foreground">Join your live class and track your engagement</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Student Mode
          </Badge>
        </div>

        <Tabs defaultValue="live-class" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live-class">Live Class</TabsTrigger>
            <TabsTrigger value="attention">Attention Tracking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live-class" className="space-y-6">
            <JitsiMeetStable
              roomName={getRoomName()}
              displayName={user?.name || 'Student'}
              userRole="student"
              onJoinMeeting={handleJoinMeeting}
              onLeaveMeeting={handleLeaveMeeting}
            />
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Class Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={isInLiveClass ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"}>
                    {isInLiveClass ? "In Class" : "Not Joined"}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Attention Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{attentionScore}%</div>
                  <Progress value={attentionScore} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Face Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={faceDetected ? "default" : "outline"}>
                    {faceDetected ? "Detected" : "Not Detected"}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attention" className="space-y-6">
            <AttentionTracker
              isActive={isTracking}
              isInLiveClass={isInLiveClass}
              onAttentionUpdate={handleAttentionUpdate}
              onFaceDetected={handleFaceDetected}
            />
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Your Status
                  </CardTitle>
                  <CardDescription>Real-time attendance and engagement status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span>Attendance Status</span>
                      </div>
                      <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-blue-500" />
                        <span>Face Detection</span>
                      </div>
                      <Badge variant={faceDetected ? "default" : "outline"}>
                        {faceDetected ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Attention Level</span>
                        <span className="text-sm font-semibold text-green-600">{attentionScore}%</span>
                      </div>
                      <Progress value={attentionScore} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {attentionScore >= 80 ? "Excellent focus!" : 
                         attentionScore >= 60 ? "Good attention" : 
                         "Please focus on the class"}
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Join Time:</span>
                          <span className="font-medium">09:05 AM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Session Duration:</span>
                          <span className="font-medium">1h 25m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Engagement Score:</span>
                          <span className={`font-medium ${
                            attentionScore >= 80 ? 'text-green-600' : 
                            attentionScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {attentionScore >= 80 ? 'A+' : attentionScore >= 60 ? 'B' : 'C'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tracking Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={toggleTracking} 
                    className="w-full"
                    variant={isTracking ? "destructive" : "default"}
                    disabled={isInLiveClass}
                  >
                    {isTracking ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Stop Attention Tracking
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {isInLiveClass ? "Available after live class" : "Start Attention Tracking"}
                      </>
                    )}
                  </Button>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {isInLiveClass 
                        ? "Attention tracking is automatically managed during live classes through video conferencing."
                        : "Your attention is being tracked using AI. Stay focused and keep your face visible for accurate monitoring."
                      }
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live Class Management</h1>
          <p className="text-muted-foreground">Conduct live classes and monitor student attendance & engagement</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Faculty Mode
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={toggleTracking} variant={isTracking ? "destructive" : "default"}>
            {isTracking ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Session
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live-class" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live-class">Live Class</TabsTrigger>
          <TabsTrigger value="monitoring">Student Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Session Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live-class" className="space-y-6">
          <JitsiMeetStable
            roomName={getRoomName()}
            displayName={user?.name || 'Teacher'}
            userRole="faculty"
            onJoinMeeting={handleJoinMeeting}
            onLeaveMeeting={handleLeaveMeeting}
          />
          
          {/* Live Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sessionStats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Enrolled in session</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{sessionStats.presentStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((sessionStats.presentStudents / sessionStats.totalStudents) * 100)}% attendance rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Attention</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sessionStats.averageFocus}%</div>
                <Progress value={sessionStats.averageFocus} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{sessionStats.alerts}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-6">

          {/* Live Student Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Live Student Monitoring
              </CardTitle>
              <CardDescription>Real-time tracking of student presence and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {student.faceDetected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                            <Camera className="w-2 h-2 text-white m-0.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {student.rollNo} • Joined: {student.joinTime}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">Attention:</span>
                          <span className={`font-semibold ${getFocusColor(student.focusLevel)}`}>
                            {student.focusLevel}%
                          </span>
                        </div>
                        <Progress value={student.focusLevel} className="w-20 h-2" />
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">
                          Last seen: {student.lastSeen}
                        </p>
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          {/* Session Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Session Configuration</CardTitle>
              <CardDescription>Configure tracking settings for the current session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Face Detection</label>
                    <p className="text-xs text-muted-foreground">Automatically detect student presence</p>
                  </div>
                  <Switch checked={faceDetectionEnabled} onCheckedChange={setFaceDetectionEnabled} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Attention Tracking</label>
                    <p className="text-xs text-muted-foreground">Monitor student engagement levels using AI</p>
                  </div>
                  <Switch checked={focusTrackingEnabled} onCheckedChange={setFocusTrackingEnabled} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Attention Tracker for Faculty */}
          <AttentionTracker
            isActive={focusTrackingEnabled}
            onAttentionUpdate={handleAttentionUpdate}
            onFaceDetected={handleFaceDetected}
          />
        </TabsContent>
      </Tabs>

      {/* Alerts */}
      {sessionStats.alerts > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {sessionStats.alerts} students require attention. Check the monitoring panel for details.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AttendanceTrackingPage;