import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import AttendanceWidget from '@/components/AttendanceWidget';
import {
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  UserCheck
} from 'lucide-react';

const StudentDashboard = () => {
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-student" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">+2 from last semester</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.4%</div>
            <p className="text-xs text-success">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h 30m</div>
            <p className="text-xs text-muted-foreground">Mathematics 101</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
            <CardDescription>Your enrolled courses this semester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Mathematics 101', progress: 75, status: 'active', nextClass: 'Today 2:30 PM' },
              { name: 'Physics Fundamentals', progress: 60, status: 'active', nextClass: 'Tomorrow 10:00 AM' },
              { name: 'Computer Science', progress: 85, status: 'active', nextClass: 'Wed 1:00 PM' },
            ].map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{course.name}</h4>
                  <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{course.progress}% complete</span>
                  <span>{course.nextClass}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Attendance Widget */}
        <AttendanceWidget variant="student" />

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Assignments due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Math Problem Set 5', course: 'Mathematics 101', dueDate: 'Due Tomorrow', priority: 'high' },
              { title: 'Physics Lab Report', course: 'Physics Fundamentals', dueDate: 'Due Friday', priority: 'medium' },
              { title: 'Programming Project', course: 'Computer Science', dueDate: 'Due Next Week', priority: 'low' },
            ].map((assignment, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  assignment.priority === 'high' ? 'bg-destructive/10' :
                  assignment.priority === 'medium' ? 'bg-warning/10' : 'bg-muted'
                }`}>
                  <AlertCircle className={`h-4 w-4 ${
                    assignment.priority === 'high' ? 'text-destructive' :
                    assignment.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  <p className="text-sm font-medium">{assignment.dueDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Video className="h-6 w-6" />
              <span>Join Live Class</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Submit Assignment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>View Timetable</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <UserCheck className="h-6 w-6" />
              <span>View Attendance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;