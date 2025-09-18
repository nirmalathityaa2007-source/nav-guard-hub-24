import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Clock,
  Target,
  Calendar,
  Award,
  Download,
  Filter
} from 'lucide-react';

const AnalyticsPage = () => {
  // Mock data - in real app this would come from an API
  const dashboardStats = {
    totalStudents: 2456,
    activeUsers: 1829,
    courseCompletion: 73.2,
    averageGrade: 82.5,
    totalCourses: 127,
    liveClasses: 24,
    assignmentsSubmitted: 8934,
    studyHours: 15624
  };

  const courseAnalytics = [
    {
      id: 1,
      course: 'Mathematics 101',
      students: 245,
      completion: 78.5,
      avgGrade: 84.2,
      engagementScore: 87,
      dropoutRate: 12.2,
      studyHours: 1820
    },
    {
      id: 2,
      course: 'Physics Fundamentals',
      students: 189,
      completion: 68.9,
      avgGrade: 79.8,
      engagementScore: 74,
      dropoutRate: 18.5,
      studyHours: 1456
    },
    {
      id: 3,
      course: 'Computer Science',
      students: 312,
      completion: 82.1,
      avgGrade: 88.7,
      engagementScore: 91,
      dropoutRate: 8.9,
      studyHours: 2134
    },
    {
      id: 4,
      course: 'Statistics',
      students: 203,
      completion: 89.2,
      avgGrade: 85.6,
      engagementScore: 88,
      dropoutRate: 6.4,
      studyHours: 1567
    }
  ];

  const weeklyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    engagement: [68, 72, 75, 78, 74, 79, 83, 85],
    completion: [45, 52, 58, 64, 69, 73, 76, 78],
    assignments: [127, 143, 156, 171, 184, 195, 208, 221]
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'text-success';
    if (completion >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive learning analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">74% engagement rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.courseCompletion}%</div>
            <p className="text-xs text-success">+3.2% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.averageGrade}%</div>
            <p className="text-xs text-success">+1.8% improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Course Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Weekly Engagement Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Engagement Trends
                </CardTitle>
                <CardDescription>Student engagement over the past 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {weeklyData.engagement.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-8 bg-primary rounded-t transition-all hover:bg-primary/80"
                        style={{ height: `${(value / 100) * 200}px` }}
                        title={`${value}%`}
                      />
                      <span className="text-xs text-muted-foreground rotate-45 origin-bottom">
                        {weeklyData.labels[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assignment Submission Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Assignment Submissions
                </CardTitle>
                <CardDescription>Weekly assignment submission counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {weeklyData.assignments.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-8 bg-faculty rounded-t transition-all hover:bg-faculty/80"
                        style={{ height: `${(value / Math.max(...weeklyData.assignments)) * 200}px` }}
                        title={`${value} submissions`}
                      />
                      <span className="text-xs text-muted-foreground rotate-45 origin-bottom">
                        {weeklyData.labels[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{dashboardStats.totalCourses}</div>
                    <div className="text-sm text-muted-foreground">Total Courses</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-faculty">{dashboardStats.liveClasses}</div>
                    <div className="text-sm text-muted-foreground">Live Classes</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-admin">{dashboardStats.assignmentsSubmitted.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Assignments</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-success">{dashboardStats.studyHours.toLocaleString()}h</div>
                    <div className="text-sm text-muted-foreground">Study Hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
                <CardDescription>Courses with highest completion rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courseAnalytics
                  .sort((a, b) => b.completion - a.completion)
                  .slice(0, 3)
                  .map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{course.course}</p>
                          <p className="text-sm text-muted-foreground">{course.students} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getCompletionColor(course.completion)}`}>
                          {course.completion}%
                        </p>
                        <p className="text-sm text-muted-foreground">completion</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Course Analytics Tab */}
        <TabsContent value="courses">
          <div className="grid gap-4">
            {courseAnalytics.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.course}</CardTitle>
                      <CardDescription>{course.students} enrolled students</CardDescription>
                    </div>
                    <Badge variant={course.completion >= 80 ? 'default' : course.completion >= 60 ? 'secondary' : 'destructive'}>
                      {course.completion >= 80 ? 'High Performance' : course.completion >= 60 ? 'Moderate Performance' : 'Needs Attention'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className={`font-semibold text-lg ${getCompletionColor(course.completion)}`}>
                        {course.completion}%
                      </div>
                      <div className="text-muted-foreground">Completion Rate</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-lg">{course.avgGrade}%</div>
                      <div className="text-muted-foreground">Avg Grade</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-lg">{course.engagementScore}%</div>
                      <div className="text-muted-foreground">Engagement</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-lg text-destructive">{course.dropoutRate}%</div>
                      <div className="text-muted-foreground">Dropout Rate</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-lg">{course.studyHours}h</div>
                      <div className="text-muted-foreground">Study Hours</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-lg">{course.students}</div>
                      <div className="text-muted-foreground">Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>User activity patterns throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                    const activity = [85, 92, 88, 91, 87, 45, 38][index];
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="font-medium w-20">{day}</span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${activity}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold w-12">{activity}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Hours</CardTitle>
                <CardDescription>Most active times during the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '8:00 - 10:00 AM', users: 450, percentage: 65 },
                    { time: '10:00 - 12:00 PM', users: 620, percentage: 89 },
                    { time: '2:00 - 4:00 PM', users: 580, percentage: 83 },
                    { time: '4:00 - 6:00 PM', users: 390, percentage: 56 },
                    { time: '8:00 - 10:00 PM', users: 280, percentage: 40 }
                  ].map((slot) => (
                    <div key={slot.time} className="flex items-center justify-between">
                      <span className="font-medium w-32">{slot.time}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-faculty h-2 rounded-full transition-all"
                            style={{ width: `${slot.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold w-16">{slot.users} users</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Overall performance across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { range: 'A (90-100%)', count: 624, percentage: 35, color: 'bg-success' },
                    { range: 'B (80-89%)', count: 712, percentage: 40, color: 'bg-primary' },
                    { range: 'C (70-79%)', count: 356, percentage: 20, color: 'bg-warning' },
                    { range: 'D (60-69%)', count: 71, percentage: 4, color: 'bg-destructive' },
                    { range: 'F (Below 60%)', count: 18, percentage: 1, color: 'bg-muted-foreground' }
                  ].map((grade) => (
                    <div key={grade.range} className="text-center">
                      <div className={`h-32 ${grade.color} rounded-lg mb-2 flex items-end justify-center pb-2`}>
                        <span className="text-white font-bold">{grade.percentage}%</span>
                      </div>
                      <p className="font-medium">{grade.range}</p>
                      <p className="text-sm text-muted-foreground">{grade.count} students</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Performance</CardTitle>
                  <CardDescription>Submission and grading statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>On-time Submissions</span>
                    <span className="font-semibold">87.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Late Submissions</span>
                    <span className="font-semibold text-warning">8.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Missing Submissions</span>
                    <span className="font-semibold text-destructive">4.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Grade</span>
                    <span className="font-semibold">{dashboardStats.averageGrade}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Outcomes</CardTitle>
                  <CardDescription>Achievement of course objectives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { objective: 'Problem Solving', achievement: 89 },
                    { objective: 'Critical Thinking', achievement: 76 },
                    { objective: 'Practical Application', achievement: 82 },
                    { objective: 'Theoretical Knowledge', achievement: 91 }
                  ].map((item) => (
                    <div key={item.objective} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.objective}</span>
                        <span className="font-semibold">{item.achievement}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${item.achievement}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;