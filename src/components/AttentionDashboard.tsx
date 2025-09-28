import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Eye,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

interface AttentionDashboardProps {
  userRole: 'student' | 'faculty' | 'admin';
  currentAttentionScore?: number;
}

const AttentionDashboard: React.FC<AttentionDashboardProps> = ({
  userRole,
  currentAttentionScore = 0
}) => {
  // Mock data - in real app, this would come from your Supabase backend
  const studentAttention = {
    current: currentAttentionScore,
    average: 78,
    sessions: 15,
    totalTime: 240, // minutes
    trend: '+5%'
  };

  const classAttention = [
    { name: 'Alice Johnson', score: 92, status: 'excellent' },
    { name: 'Bob Smith', score: 78, status: 'good' },
    { name: 'Carol Davis', score: 65, status: 'fair' },
    { name: 'David Wilson', score: 45, status: 'poor' },
    { name: 'Emma Brown', score: 88, status: 'excellent' },
    { name: 'Frank Miller', score: 72, status: 'good' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Good' };
    if (score >= 40) return { variant: 'outline' as const, label: 'Fair' };
    return { variant: 'destructive' as const, label: 'Poor' };
  };

  if (userRole === 'student') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            My Attention Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Session */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Session</span>
              <span className={`text-2xl font-bold ${getScoreColor(studentAttention.current)}`}>
                {studentAttention.current}%
              </span>
            </div>
            <Progress value={studentAttention.current} className="h-3" />
            <Badge {...getScoreBadge(studentAttention.current)}>
              {getScoreBadge(studentAttention.current).label}
            </Badge>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{studentAttention.average}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{studentAttention.sessions}</div>
              <div className="text-sm text-muted-foreground">Sessions Tracked</div>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-2">
            <h4 className="font-medium">Insights</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Your attention has improved by {studentAttention.trend} this week</p>
              <p>• Best performance time: 10:00 AM - 12:00 PM</p>
              <p>• Total tracked time: {Math.floor(studentAttention.totalTime / 60)}h {studentAttention.totalTime % 60}m</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userRole === 'faculty') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Class Attention Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="live" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="live">Live Session</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Students Online</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">74%</div>
                  <div className="text-sm text-muted-foreground">Avg Attention</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-muted-foreground">Need Help</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Student Attention Scores</h4>
                {classAttention.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        student.status === 'excellent' ? 'bg-green-500' :
                        student.status === 'good' ? 'bg-yellow-500' :
                        student.status === 'fair' ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(student.score)}`}>
                        {student.score}%
                      </span>
                      {student.score < 50 && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="text-center p-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Historical attention data will be available here.</p>
                <p className="text-sm">Connect to Supabase to enable data persistence.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  // Admin view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          System-wide Attention Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">76%</div>
            <div className="text-sm text-muted-foreground">Avg Attention</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold">127</div>
            <div className="text-sm text-muted-foreground">Active Classes</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold">1,429</div>
            <div className="text-sm text-muted-foreground">Live Sessions</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Recent Alerts</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="flex-1">
                <div className="font-medium">Low attention in Mathematics 101</div>
                <div className="text-sm text-muted-foreground">Average dropped to 45% - 5 min ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <div className="font-medium">Physics class performing well</div>
                <div className="text-sm text-muted-foreground">Average attention: 89% - 15 min ago</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttentionDashboard;