import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Award, 
  Target, 
  BookOpen, 
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Star
} from 'lucide-react';

const ProgressPage = () => {
  const overallStats = {
    coursesCompleted: 2,
    coursesInProgress: 4,
    totalCourses: 6,
    averageGrade: 85.4,
    studyHours: 127,
    assignmentsCompleted: 18,
    certificatesEarned: 2
  };

  const courseProgress = [
    {
      id: 1,
      title: 'Mathematics 101',
      instructor: 'Dr. Smith',
      progress: 75,
      grade: 87.5,
      timeSpent: 45,
      lessonsCompleted: 18,
      totalLessons: 24,
      assignments: { completed: 5, total: 6 },
      nextMilestone: 'Final Exam',
      difficulty: 'Medium',
      status: 'on-track'
    },
    {
      id: 2,
      title: 'Physics Fundamentals',
      instructor: 'Prof. Johnson',
      progress: 60,
      grade: 82.1,
      timeSpent: 38,
      lessonsCompleted: 12,
      totalLessons: 20,
      assignments: { completed: 3, total: 5 },
      nextMilestone: 'Midterm Exam',
      difficulty: 'Hard',
      status: 'behind'
    },
    {
      id: 3,
      title: 'Computer Science',
      instructor: 'Dr. Wilson',
      progress: 85,
      grade: 91.2,
      timeSpent: 32,
      lessonsCompleted: 25,
      totalLessons: 30,
      assignments: { completed: 7, total: 8 },
      nextMilestone: 'Project Presentation',
      difficulty: 'Medium',
      status: 'ahead'
    },
    {
      id: 4,
      title: 'Statistics',
      instructor: 'Prof. Davis',
      progress: 100,
      grade: 88.7,
      timeSpent: 28,
      lessonsCompleted: 18,
      totalLessons: 18,
      assignments: { completed: 6, total: 6 },
      nextMilestone: 'Completed',
      difficulty: 'Easy',
      status: 'completed'
    }
  ];

  const achievements = [
    { title: 'First Course Complete', description: 'Completed your first course', earned: true, date: '2023-09-15' },
    { title: 'Perfect Score', description: 'Achieved 100% on an assignment', earned: true, date: '2023-10-01' },
    { title: 'Study Streak', description: '7 days of consecutive study', earned: true, date: '2023-10-10' },
    { title: 'Quick Learner', description: 'Complete a course in under 30 hours', earned: false, progress: 85 },
    { title: 'High Achiever', description: 'Maintain 90%+ average across all courses', earned: false, progress: 65 },
    { title: 'Dedicated Student', description: 'Complete 100 hours of study time', earned: false, progress: 78 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'default';
      case 'on-track': return 'secondary';
      case 'behind': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'secondary';
      case 'Medium': return 'default';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground">Monitor your learning journey and academic achievements</p>
      </div>

      {/* Overall Progress Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((overallStats.coursesCompleted + (overallStats.coursesInProgress * 0.6)) / overallStats.totalCourses * 100)}%</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageGrade}%</div>
            <p className="text-xs text-success">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.studyHours}h</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.certificatesEarned}</div>
            <p className="text-xs text-muted-foreground">Earned this year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Course Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Course Progress Tab */}
        <TabsContent value="courses">
          <div className="grid gap-4">
            {courseProgress.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.instructor}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                      <Badge variant={getStatusColor(course.status)}>
                        {course.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                  </div>

                  {/* Course Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold">{course.grade}%</div>
                      <div className="text-muted-foreground">Current Grade</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold">{course.timeSpent}h</div>
                      <div className="text-muted-foreground">Time Spent</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold">{course.lessonsCompleted}/{course.totalLessons}</div>
                      <div className="text-muted-foreground">Lessons</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold">{course.assignments.completed}/{course.assignments.total}</div>
                      <div className="text-muted-foreground">Assignments</div>
                    </div>
                  </div>

                  {/* Next Milestone */}
                  <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div>
                      <span className="font-medium">Next Milestone: </span>
                      <span>{course.nextMilestone}</span>
                    </div>
                    {course.status !== 'completed' && (
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4 mr-2" />
                        Focus
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <Card key={index} className={achievement.earned ? 'border-success/20 bg-success/5' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.earned ? (
                          <Award className="h-6 w-6" />
                        ) : (
                          <Target className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                    {achievement.earned && (
                      <Badge variant="outline" className="text-success border-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {achievement.earned ? (
                    <p className="text-sm text-muted-foreground">
                      Earned on {new Date(achievement.date!).toLocaleDateString()}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Study Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Study Hours
                </CardTitle>
                <CardDescription>Your study time over the past 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-end justify-between gap-2">
                  {[12, 15, 8, 22, 18, 25, 20, 16].map((hours, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-8 bg-primary rounded-t"
                        style={{ height: `${(hours / 25) * 120}px` }}
                      />
                      <span className="text-xs text-muted-foreground">W{index + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Grade Trends
                </CardTitle>
                <CardDescription>Average grades by subject area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: 'Mathematics', grade: 87.5, trend: '+2.3%' },
                  { subject: 'Physics', grade: 82.1, trend: '+1.8%' },
                  { subject: 'Computer Science', grade: 91.2, trend: '+4.1%' },
                  { subject: 'Statistics', grade: 88.7, trend: '+0.5%' }
                ].map((item) => (
                  <div key={item.subject} className="flex items-center justify-between">
                    <span className="font-medium">{item.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.grade}%</span>
                      <Badge variant="outline" className="text-success">
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Habits */}
            <Card>
              <CardHeader>
                <CardTitle>Study Habits</CardTitle>
                <CardDescription>Insights about your learning patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-semibold">2:30 PM</div>
                    <div className="text-muted-foreground">Peak Study Time</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-semibold">Tuesday</div>
                    <div className="text-muted-foreground">Most Active Day</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-semibold">3.2h</div>
                    <div className="text-muted-foreground">Avg Session</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-semibold">89%</div>
                    <div className="text-muted-foreground">Completion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals & Targets */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
                <CardDescription>Track your academic targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { goal: 'Maintain 85%+ average', current: 85.4, target: 85, unit: '%' },
                  { goal: 'Study 20h per week', current: 18, target: 20, unit: 'h' },
                  { goal: 'Complete all assignments', current: 18, target: 20, unit: '' }
                ].map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{goal.goal}</span>
                      <span>{goal.current}{goal.unit} / {goal.target}{goal.unit}</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressPage;