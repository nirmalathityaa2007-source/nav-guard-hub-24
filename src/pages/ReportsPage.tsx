import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileBarChart, Download, Calendar, Users, TrendingUp, FileText } from 'lucide-react';

const ReportsPage = () => {
  const reports = [
    {
      id: 1,
      title: 'Student Performance Report',
      description: 'Comprehensive analysis of student grades and progress',
      type: 'Academic',
      lastGenerated: '2023-10-20',
      frequency: 'Monthly',
      status: 'ready'
    },
    {
      id: 2,
      title: 'Course Completion Analytics',
      description: 'Course-wise completion rates and dropout analysis',
      type: 'Analytics',
      lastGenerated: '2023-10-18',
      frequency: 'Weekly',
      status: 'ready'
    },
    {
      id: 3,
      title: 'Faculty Activity Summary',
      description: 'Teaching load, student feedback, and course metrics',
      type: 'Faculty',
      lastGenerated: '2023-10-15',
      frequency: 'Monthly',
      status: 'processing'
    },
    {
      id: 4,
      title: 'System Usage Report',
      description: 'Platform usage statistics and user engagement',
      type: 'System',
      lastGenerated: '2023-10-22',
      frequency: 'Daily',
      status: 'ready'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and access educational analytics reports</p>
        </div>
        <Button>
          <FileBarChart className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Ready to download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Analyzed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground">Across all reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-success">+5.2% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Report Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
                <Badge variant={report.status === 'ready' ? 'default' : 'secondary'}>
                  {report.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Type: {report.type}</span>
                <span>Frequency: {report.frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last generated: {report.lastGenerated}
                </span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" disabled={report.status !== 'ready'}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;