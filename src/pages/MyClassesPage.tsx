import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Play, 
  Users, 
  Calendar, 
  FileText, 
  Video,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

const MyClassesPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Mathematics 101',
      instructor: 'Dr. Smith',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      nextLesson: 'Calculus Fundamentals',
      nextLessonTime: 'Today, 2:30 PM',
      enrolled: 45,
      rating: 4.8,
      status: 'active',
      category: 'mathematics'
    },
    {
      id: 2,
      title: 'Physics Fundamentals',
      instructor: 'Prof. Johnson',
      progress: 60,
      totalLessons: 20,
      completedLessons: 12,
      nextLesson: 'Newton\'s Laws',
      nextLessonTime: 'Tomorrow, 10:00 AM',
      enrolled: 38,
      rating: 4.6,
      status: 'active',
      category: 'science'
    },
    {
      id: 3,
      title: 'Computer Science',
      instructor: 'Dr. Wilson',
      progress: 85,
      totalLessons: 30,
      completedLessons: 25,
      nextLesson: 'Data Structures',
      nextLessonTime: 'Wed, 1:00 PM',
      enrolled: 52,
      rating: 4.9,
      status: 'active',
      category: 'technology'
    },
    {
      id: 4,
      title: 'Statistics',
      instructor: 'Prof. Davis',
      progress: 100,
      totalLessons: 18,
      completedLessons: 18,
      nextLesson: 'Course Completed',
      nextLessonTime: null,
      enrolled: 42,
      rating: 4.7,
      status: 'completed',
      category: 'mathematics'
    }
  ];

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'active') return course.status === 'active';
    if (activeTab === 'completed') return course.status === 'completed';
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">Track your course progress and access learning materials</p>
      </div>

      {/* Course Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter(c => c.status === 'active').length} active, {courses.filter(c => c.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127h</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Users className="h-4 w-4" />
                        {course.instructor} • {course.enrolled} students
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={course.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      {course.progress}% complete
                    </div>
                  </div>

                  {/* Next Lesson */}
                  {course.status === 'active' && course.nextLessonTime && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Next Lesson</p>
                          <p className="text-sm text-muted-foreground">{course.nextLesson}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{course.nextLessonTime}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Course Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-sm text-muted-foreground">rating</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {course.status === 'active' ? (
                      <>
                        <Button className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                        <Button variant="outline" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Certificate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest learning activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Completed lesson', course: 'Computer Science', time: '2 hours ago', icon: CheckCircle },
              { action: 'Submitted assignment', course: 'Mathematics 101', time: '1 day ago', icon: FileText },
              { action: 'Joined live session', course: 'Physics Fundamentals', time: '2 days ago', icon: Video },
              { action: 'Downloaded resources', course: 'Statistics', time: '3 days ago', icon: BookOpen }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-full">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.course} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyClassesPage;