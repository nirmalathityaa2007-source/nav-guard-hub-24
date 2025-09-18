import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import AttendanceWidget from '@/components/AttendanceWidget';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Video,
  BarChart3,
  UserCheck
} from 'lucide-react';

const FacultyDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
        <p className="text-muted-foreground">Manage your courses and track student progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card border-faculty/20 bg-gradient-to-br from-faculty/10 to-faculty/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-faculty" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Across 4 courses</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-faculty" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments to Grade</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Class Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-success">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance Widget */}
        <AttendanceWidget variant="faculty" />

        {/* Recent Student Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Student Activity</CardTitle>
            <CardDescription>Latest submissions and activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { student: 'Alice Johnson', activity: 'Submitted Assignment 3', course: 'Calculus I', time: '10 min ago', status: 'submitted' },
              { student: 'Bob Smith', activity: 'Attended Live Class', course: 'Statistics', time: '1 hour ago', status: 'attended' },
              { student: 'Carol Davis', activity: 'Submitted Quiz 2', course: 'Linear Algebra', time: '2 hours ago', status: 'submitted' },
              { student: 'David Wilson', activity: 'Requested Help', course: 'Advanced Mathematics', time: '3 hours ago', status: 'help' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.status === 'submitted' ? 'bg-success/10' :
                  activity.status === 'attended' ? 'bg-primary/10' :
                  activity.status === 'help' ? 'bg-warning/10' : 'bg-muted'
                }`}>
                  {activity.status === 'submitted' ? <CheckCircle className="h-4 w-4 text-success" /> :
                   activity.status === 'attended' ? <Video className="h-4 w-4 text-primary" /> :
                   activity.status === 'help' ? <Clock className="h-4 w-4 text-warning" /> :
                   <FileText className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{activity.student}</h4>
                  <p className="text-sm text-muted-foreground">{activity.activity}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{activity.course}</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Faculty */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common faculty tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Grade Assignments</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Video className="h-6 w-6" />
              <span>Start Live Class</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <UserCheck className="h-6 w-6" />
              <span>Track Attendance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;