import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  Eye,
  Download,
  Edit,
  ArrowLeft,
  BookOpen
} from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  course: string;
  instructor: string;
  dueDate: string;
  daysLeft: number;
  status: 'pending' | 'submitted' | 'graded';
  priority: 'high' | 'medium' | 'low';
  points: number;
  description: string;
  submissionType: string;
  attempts: number;
  maxAttempts: number;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
}

const AssignmentsPage = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  const assignments: Assignment[] = [
    {
      id: 1,
      title: 'Assignment 1: Calculus Problem Set 5',
      course: 'Mathematics',
      instructor: 'Dr. Smith',
      dueDate: 'Tomorrow, 11:59 PM',
      daysLeft: 1,
      status: 'pending',
      priority: 'high',
      points: 100,
      description: 'Solve integration problems 1-25 from Chapter 8',
      submissionType: 'file',
      attempts: 0,
      maxAttempts: 1
    },
    {
      id: 2,
      title: 'Assignment 2: Geometry Proof Assignment',
      course: 'Mathematics',
      instructor: 'Dr. Smith',
      dueDate: 'Graded on Oct 10',
      daysLeft: 0,
      status: 'graded',
      priority: 'medium',
      points: 80,
      grade: 87,
      description: 'Prove theorems using geometric principles',
      submissionType: 'file',
      attempts: 1,
      maxAttempts: 1,
      feedback: 'Good work! Your proofs are clear and well-structured. Minor deduction for formatting.'
    },
    {
      id: 3,
      title: 'Assignment 1: Physics Lab Report - Motion Study',
      course: 'Physics',
      instructor: 'Prof. Johnson',
      dueDate: 'Friday, 11:59 PM',
      daysLeft: 3,
      status: 'pending',
      priority: 'medium',
      points: 75,
      description: 'Write a comprehensive report on the motion experiment conducted last week',
      submissionType: 'file',
      attempts: 0,
      maxAttempts: 2
    },
    {
      id: 4,
      title: 'Assignment 1: Data Structures Quiz',
      course: 'Computer Science',
      instructor: 'Dr. Wilson',
      dueDate: 'Next Week Monday, 2:00 PM',
      daysLeft: 5,
      status: 'pending',
      priority: 'low',
      points: 50,
      description: 'Online quiz covering arrays, linked lists, and stacks',
      submissionType: 'online',
      attempts: 0,
      maxAttempts: 1
    },
    {
      id: 5,
      title: 'Assignment 1: Statistical Analysis Project',
      course: 'Statistics',
      instructor: 'Prof. Davis',
      dueDate: 'Submitted on Oct 15',
      daysLeft: 0,
      status: 'submitted',
      priority: 'medium',
      points: 120,
      grade: 95,
      description: 'Analyze the provided dataset and present findings',
      submissionType: 'file',
      attempts: 1,
      maxAttempts: 1,
      submittedAt: 'Oct 15, 2023 at 3:45 PM'
    },
    {
      id: 6,
      title: 'Assignment 1: Essay on Shakespeare',
      course: 'English',
      instructor: 'Ms. Brown',
      dueDate: 'Next Week Friday, 11:59 PM',
      daysLeft: 8,
      status: 'pending',
      priority: 'medium',
      points: 100,
      description: 'Write a 5-page essay analyzing themes in Hamlet',
      submissionType: 'file',
      attempts: 0,
      maxAttempts: 2
    }
  ];

  const subjects = Array.from(new Set(assignments.map(a => a.course)));

  const getSubjectStats = (subject: string) => {
    const subjectAssignments = assignments.filter(a => a.course === subject);
    return {
      total: subjectAssignments.length,
      pending: subjectAssignments.filter(a => a.status === 'pending').length,
      submitted: subjectAssignments.filter(a => a.status === 'submitted').length,
      graded: subjectAssignments.filter(a => a.status === 'graded').length,
      averageGrade: subjectAssignments.filter(a => a.grade).length > 0 
        ? subjectAssignments.filter(a => a.grade).reduce((acc, a) => acc + (a.grade || 0), 0) / subjectAssignments.filter(a => a.grade).length 
        : null
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'submitted': return 'secondary';
      case 'graded': return 'outline';
      default: return 'secondary';
    }
  };

  if (selectedSubject) {
    const subjectAssignments = assignments.filter(a => a.course === selectedSubject);
    const filteredAssignments = subjectAssignments.filter(assignment => {
      if (activeTab === 'pending') return assignment.status === 'pending';
      if (activeTab === 'submitted') return assignment.status === 'submitted';
      if (activeTab === 'graded') return assignment.status === 'graded';
      return true;
    });

    const stats = getSubjectStats(selectedSubject);

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedSubject(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{selectedSubject} Assignments</h1>
            <p className="text-muted-foreground">Manage your {selectedSubject} coursework and deadlines</p>
          </div>
        </div>

        {/* Subject Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.submitted}</div>
              <p className="text-xs text-muted-foreground">Awaiting grades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Graded</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.graded}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageGrade ? `${stats.averageGrade.toFixed(1)}%` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Subject performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Assignment List */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'pending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('pending')}
            >
              Pending {stats.pending > 0 && `(${stats.pending})`}
            </Button>
            <Button 
              variant={activeTab === 'submitted' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('submitted')}
            >
              Submitted
            </Button>
            <Button 
              variant={activeTab === 'graded' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('graded')}
            >
              Graded
            </Button>
            <Button 
              variant={activeTab === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
          </div>

          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription>
                      {assignment.instructor} • {assignment.points} points
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(assignment.priority)}>
                      {assignment.priority} priority
                    </Badge>
                    <Badge variant={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{assignment.description}</p>

                {/* Due Date & Time Left */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {assignment.dueDate}
                  </span>
                  {assignment.status === 'pending' && assignment.daysLeft > 0 && (
                    <span className={`flex items-center gap-1 ${
                      assignment.daysLeft === 1 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      <Clock className="h-4 w-4" />
                      {assignment.daysLeft} day{assignment.daysLeft !== 1 ? 's' : ''} left
                    </span>
                  )}
                  {assignment.status === 'pending' && assignment.daysLeft === 0 && (
                    <span className="flex items-center gap-1 text-destructive font-medium">
                      <AlertTriangle className="h-4 w-4" />
                      Due today!
                    </span>
                  )}
                </div>

                {/* Grade Display */}
                {assignment.grade && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Grade: {assignment.grade}/{assignment.points}</span>
                      <span className="text-success font-bold">
                        {((assignment.grade / assignment.points) * 100).toFixed(1)}%
                      </span>
                    </div>
                    {assignment.feedback && (
                      <p className="text-sm text-muted-foreground mt-2">{assignment.feedback}</p>
                    )}
                  </div>
                )}

                {/* Submission Status */}
                {assignment.submittedAt && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Submitted:</span> {assignment.submittedAt}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {assignment.status === 'pending' && (
                    <>
                      <Button className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </Button>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  {assignment.status === 'submitted' && (
                    <>
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Submission
                      </Button>
                      {assignment.attempts < assignment.maxAttempts && (
                        <Button variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Resubmit
                        </Button>
                      )}
                    </>
                  )}

                  {assignment.status === 'graded' && (
                    <>
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Feedback
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAssignments.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No assignments found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'pending' && 'Great! You\'re all caught up with your assignments.'}
                  {activeTab === 'submitted' && 'No assignments are currently awaiting grades.'}
                  {activeTab === 'graded' && 'No graded assignments to display yet.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">Select a subject to view and manage your assignments</p>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject);
          return (
            <Card 
              key={subject} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSubject(subject)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{subject}</CardTitle>
                  </div>
                  <Badge variant="secondary">{stats.total} assignments</Badge>
                </div>
                <CardDescription>Click to view all {subject} assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-warning">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary">{stats.submitted}</p>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-success">{stats.graded}</p>
                    <p className="text-xs text-muted-foreground">Graded</p>
                  </div>
                </div>
                {stats.averageGrade && (
                  <div className="mt-4 p-3 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Average Grade</p>
                    <p className="text-lg font-bold">{stats.averageGrade.toFixed(1)}%</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentsPage;