import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar as CalendarIcon, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Search,
  AlertTriangle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const AttendancePage = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');

  // Mock data - replace with real data from your backend
  const attendanceStats = {
    totalClasses: 180,
    attendedClasses: 142,
    percentage: 78.9,
    trend: '+2.5%'
  };

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'english', name: 'English' },
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'batch-a', name: 'Batch A' },
    { id: 'batch-b', name: 'Batch B' },
    { id: 'batch-c', name: 'Batch C' },
  ];

  const attendanceRecords = [
    {
      id: 1,
      subject: 'Mathematics',
      date: '2024-01-15',
      time: '09:00 AM',
      status: 'present',
      duration: '1h 30m',
      batch: 'Batch A'
    },
    {
      id: 2,
      subject: 'Physics',
      date: '2024-01-15',
      time: '11:00 AM',
      status: 'absent',
      duration: '1h 30m',
      batch: 'Batch A'
    },
    {
      id: 3,
      subject: 'Chemistry',
      date: '2024-01-14',
      time: '02:00 PM',
      status: 'present',
      duration: '2h',
      batch: 'Batch B'
    },
    {
      id: 4,
      subject: 'English',
      date: '2024-01-14',
      time: '10:00 AM',
      status: 'late',
      duration: '1h',
      batch: 'Batch A'
    },
  ];

  const students = [
    {
      id: 1,
      name: 'John Doe',
      rollNo: 'ST001',
      batch: 'Batch A',
      attendance: 85.2,
      totalClasses: 45,
      present: 38,
      absent: 7
    },
    {
      id: 2,
      name: 'Jane Smith',
      rollNo: 'ST002',
      batch: 'Batch A',
      attendance: 92.1,
      totalClasses: 45,
      present: 41,
      absent: 4
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rollNo: 'ST003',
      batch: 'Batch B',
      attendance: 76.8,
      totalClasses: 45,
      present: 35,
      absent: 10
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Present</Badge>;
      case 'absent':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" />Late</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">
            {userRole === 'student' 
              ? 'Track your attendance and view detailed records'
              : 'Monitor and manage student attendance across all classes'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.percentage}%</div>
            <p className="text-xs text-success">{attendanceStats.trend} from last month</p>
            <Progress value={attendanceStats.percentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.attendedClasses}</div>
            <p className="text-xs text-muted-foreground">Out of {attendanceStats.totalClasses} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/15</div>
            <p className="text-xs text-muted-foreground">Classes attended</p>
          </CardContent>
        </Card>

      </div>

      <Tabs defaultValue={userRole === 'student' ? 'my-attendance' : 'overview'} className="w-full">
        <TabsList>
          {userRole === 'student' && <TabsTrigger value="my-attendance">My Attendance</TabsTrigger>}
          {(userRole === 'faculty' || userRole === 'admin') && (
            <>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="mark-attendance">Mark Attendance</TabsTrigger>
            </>
          )}
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {userRole === 'student' && (
          <TabsContent value="my-attendance" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                placeholder="Search by date or subject..." 
                className="max-w-sm"
                type="text"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>Your detailed attendance history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{record.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {record.date} at {record.time} • {record.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{record.batch}</Badge>
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {(userRole === 'faculty' || userRole === 'admin') && (
          <>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Alerts</CardTitle>
                    <CardDescription>Students requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium text-red-900">Mike Johnson</p>
                          <p className="text-sm text-red-700">Attendance below 75% (76.8%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-yellow-900">Sarah Wilson</p>
                          <p className="text-sm text-yellow-700">Frequently late to classes</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Class Average</CardTitle>
                    <CardDescription>Overall performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Mathematics</span>
                          <span className="text-sm">87.5%</span>
                        </div>
                        <Progress value={87.5} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Physics</span>
                          <span className="text-sm">82.3%</span>
                        </div>
                        <Progress value={82.3} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Chemistry</span>
                          <span className="text-sm">79.1%</span>
                        </div>
                        <Progress value={79.1} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Search students..." 
                  className="max-w-sm"
                  type="text"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Student Attendance</CardTitle>
                  <CardDescription>Individual student performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-primary">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Roll No: {student.rollNo} • {student.batch}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`font-semibold ${getAttendanceColor(student.attendance)}`}>
                              {student.attendance}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student.present}/{student.totalClasses} classes
                            </p>
                          </div>
                          <Progress value={student.attendance} className="w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mark-attendance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mark Attendance</CardTitle>
                  <CardDescription>Record attendance for today's classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.slice(1).map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.slice(1).map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button>Load Students</Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Quick Actions</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Mark All Present</Button>
                      <Button variant="outline" size="sm">Mark All Absent</Button>
                      <Button variant="outline" size="sm">Copy Previous</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Present</Button>
                          <Button size="sm" variant="outline">Absent</Button>
                          <Button size="sm" variant="outline">Late</Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Attendance</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  Attendance for {selectedDate?.toLocaleDateString()}
                </CardTitle>
                <CardDescription>Classes and attendance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceRecords
                    .filter(record => record.date === selectedDate?.toISOString().split('T')[0])
                    .map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{record.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {record.time} • {record.duration}
                          </p>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                    ))}
                  {attendanceRecords.filter(record => 
                    record.date === selectedDate?.toISOString().split('T')[0]
                  ).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No classes scheduled for this date
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Create detailed attendance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Report</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                      <SelectItem value="semester">Semester Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendancePage;