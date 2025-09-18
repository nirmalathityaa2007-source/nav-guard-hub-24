import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  UserCheck, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AttendanceWidgetProps {
  variant?: 'student' | 'faculty' | 'admin';
}

export const AttendanceWidget = ({ variant = 'student' }: AttendanceWidgetProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || variant;

  const studentData = {
    overallAttendance: 78.9,
    thisWeek: 12,
    totalThisWeek: 15,
    trend: '+2.5%',
    subjects: [
      { name: 'Mathematics', attendance: 85 },
      { name: 'Physics', attendance: 72 },
      { name: 'Chemistry', attendance: 80 }
    ]
  };

  const facultyData = {
    totalStudents: 120,
    presentToday: 98,
    averageAttendance: 82.5,
    alertsCount: 5,
    recentClasses: [
      { subject: 'Mathematics', attendance: 95, time: '09:00 AM' },
      { subject: 'Physics', attendance: 87, time: '11:00 AM' }
    ]
  };

  if (userRole === 'student') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            My Attendance
          </CardTitle>
          <CardDescription>Your attendance overview and progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{studentData.overallAttendance}%</p>
              <p className="text-sm text-muted-foreground">Overall Attendance</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600">{studentData.trend}</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
          </div>

          <Progress value={studentData.overallAttendance} className="h-2" />

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-lg font-semibold">{studentData.thisWeek}/{studentData.totalThisWeek}</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-lg font-semibold">{studentData.subjects.length}</p>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Subject-wise Attendance</p>
            {studentData.subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{subject.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{subject.attendance}%</span>
                  <div className="w-16">
                    <Progress value={subject.attendance} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => navigate('/attendance')}
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (userRole === 'faculty' || userRole === 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Attendance Overview
          </CardTitle>
          <CardDescription>Monitor student attendance across all classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xl font-bold">{facultyData.presentToday}</p>
              <p className="text-sm text-muted-foreground">Present Today</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xl font-bold">{facultyData.averageAttendance}%</p>
              <p className="text-sm text-muted-foreground">Average</p>
            </div>
          </div>

          {facultyData.alertsCount > 0 && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-900">
                  {facultyData.alertsCount} students need attention
                </p>
                <p className="text-xs text-red-700">Attendance below threshold</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Classes</p>
            {facultyData.recentClasses.map((cls, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium">{cls.subject}</p>
                  <p className="text-xs text-muted-foreground">{cls.time}</p>
                </div>
                <Badge variant={cls.attendance >= 85 ? "default" : "secondary"}>
                  {cls.attendance}%
                </Badge>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/attendance')}
            >
              View Reports
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate('/attendance-tracking')}
            >
              Live Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default AttendanceWidget;