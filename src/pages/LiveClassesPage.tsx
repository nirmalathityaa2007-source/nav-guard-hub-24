import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Mic, 
  MicOff, 
  VideoIcon, 
  VideoOff,
  Monitor,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LiveClassesPage = () => {
  const [activeTab, setActiveTab] = useState('live');
  const { user } = useAuth();

  const liveClasses = [
    {
      id: 1,
      title: 'Mathematics 101 - Calculus Review',
      instructor: 'Dr. Smith',
      subject: 'Mathematics',
      startTime: '2:30 PM',
      endTime: '4:00 PM',
      participants: 42,
      maxParticipants: 50,
      status: 'live',
      duration: '1h 30m',
      isRecording: true
    },
    {
      id: 2,
      title: 'Physics Lab Session',
      instructor: 'Prof. Johnson',
      subject: 'Physics',
      startTime: '3:00 PM',
      endTime: '4:30 PM',
      participants: 28,
      maxParticipants: 35,
      status: 'live',
      duration: '1h 30m',
      isRecording: false
    }
  ];

  const upcomingClasses = [
    {
      id: 3,
      title: 'Computer Science - Data Structures',
      instructor: 'Dr. Wilson',
      subject: 'Computer Science',
      startTime: 'Tomorrow 10:00 AM',
      duration: '2h',
      participants: 0,
      maxParticipants: 60,
      status: 'scheduled'
    },
    {
      id: 4,
      title: 'Statistics Workshop',
      instructor: 'Prof. Davis',
      subject: 'Statistics',
      startTime: 'Wednesday 2:00 PM',
      duration: '1h 30m',
      participants: 15,
      maxParticipants: 40,
      status: 'scheduled'
    }
  ];

  const pastClasses = [
    {
      id: 5,
      title: 'Mathematics 101 - Integration Techniques',
      instructor: 'Dr. Smith',
      subject: 'Mathematics',
      date: 'Yesterday',
      duration: '1h 30m',
      recorded: true,
      views: 38
    },
    {
      id: 6,
      title: 'Physics Fundamentals - Motion',
      instructor: 'Prof. Johnson',
      subject: 'Physics',
      date: '2 days ago',
      duration: '2h',
      recorded: true,
      views: 45
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Classes</h1>
        <p className="text-muted-foreground">Join live sessions and access recorded classes</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Now</CardTitle>
            <Video className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{liveClasses.length}</div>
            <p className="text-xs text-muted-foreground">Active sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {liveClasses.reduce((total, cls) => total + cls.participants, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recorded Sessions</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastClasses.length}</div>
            <p className="text-xs text-muted-foreground">Available for replay</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="live" className="relative">
            Live Now
            {liveClasses.length > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full animate-pulse"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="recorded">Recorded</TabsTrigger>
        </TabsList>

        {/* Live Classes */}
        <TabsContent value="live" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {liveClasses.map((cls) => (
              <Card key={cls.id} className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{cls.title}</CardTitle>
                      <CardDescription>{cls.instructor} • {cls.subject}</CardDescription>
                    </div>
                    <Badge variant="destructive" className="animate-pulse">
                      <Video className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {cls.startTime} - {cls.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {cls.participants}/{cls.maxParticipants}
                    </span>
                  </div>

                  {cls.isRecording && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                      Recording in progress
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      {user?.role === 'faculty' ? 'Start Class' : 'Join Class'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {liveClasses.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <VideoOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No live classes at the moment</h3>
                <p className="text-muted-foreground">Check the upcoming tab for scheduled sessions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Upcoming Classes */}
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingClasses.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{cls.title}</CardTitle>
                      <CardDescription>{cls.instructor} • {cls.subject}</CardDescription>
                    </div>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {cls.startTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {cls.duration}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Expected participants</span>
                    <span>{cls.participants} registered</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recorded Classes */}
        <TabsContent value="recorded" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {pastClasses.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{cls.title}</CardTitle>
                      <CardDescription>{cls.instructor} • {cls.subject}</CardDescription>
                    </div>
                    <Badge variant="outline">Recorded</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {cls.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {cls.duration}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Views</span>
                    <span>{cls.views} students watched</span>
                  </div>

                  <Button className="w-full">
                    <Monitor className="h-4 w-4 mr-2" />
                    Watch Recording
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveClassesPage;