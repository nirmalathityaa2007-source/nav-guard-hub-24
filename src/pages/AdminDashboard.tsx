import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttentionDashboard from '@/components/AttentionDashboard';
import {
  Users,
  BookOpen,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  Server,
  Database,
  Settings,
  UserPlus,
  FileBarChart,
  Eye,
  Monitor
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and administration panel.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attention">Attention Analytics</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card border-admin/20 bg-gradient-to-br from-admin/10 to-admin/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-admin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-admin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-success">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management Overview */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Overview of system users by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { role: 'Students', count: 2456, percentage: 86, color: 'student' },
              { role: 'Faculty', count: 378, percentage: 13, color: 'faculty' },
              { role: 'Administrators', count: 13, percentage: 1, color: 'admin' }
            ].map((userType, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    userType.color === 'student' ? 'bg-student' :
                    userType.color === 'faculty' ? 'bg-faculty' : 'bg-admin'
                  }`} />
                  <span className="font-medium">{userType.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{userType.count}</span>
                  <Badge variant="secondary">{userType.percentage}%</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'High CPU Usage', description: 'Server load at 85%', severity: 'warning', time: '5 min ago' },
              { title: 'Database Backup Complete', description: 'Daily backup successful', severity: 'success', time: '1 hour ago' },
              { title: 'Failed Login Attempts', description: '3 failed attempts detected', severity: 'error', time: '2 hours ago' },
              { title: 'System Update Available', description: 'Security patch ready', severity: 'info', time: '1 day ago' }
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  alert.severity === 'error' ? 'bg-destructive/10' :
                  alert.severity === 'warning' ? 'bg-warning/10' :
                  alert.severity === 'success' ? 'bg-success/10' : 'bg-primary/10'
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.severity === 'error' ? 'text-destructive' :
                    alert.severity === 'warning' ? 'text-warning' :
                    alert.severity === 'success' ? 'text-success' : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Tools</CardTitle>
          <CardDescription>System management and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <UserPlus className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Shield className="h-6 w-6" />
              <span>Permissions</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileBarChart className="h-6 w-6" />
              <span>System Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Settings className="h-6 w-6" />
              <span>System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="attention" className="space-y-6">
          <AttentionDashboard userRole="admin" />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">

      {/* System Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>CPU Usage</span>
                <Badge variant="secondary">45%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Memory</span>
                <Badge variant="secondary">67%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Uptime</span>
                <Badge variant="outline">15d 4h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Size</span>
                <Badge variant="secondary">2.4 GB</Badge>
              </div>
              <div className="flex justify-between">
                <span>Connections</span>
                <Badge variant="secondary">24/100</Badge>
              </div>
              <div className="flex justify-between">
                <span>Last Backup</span>
                <Badge variant="outline">1h ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Response Time</span>
                <Badge variant="secondary">120ms</Badge>
              </div>
              <div className="flex justify-between">
                <span>Requests/min</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <div className="flex justify-between">
                <span>Error Rate</span>
                <Badge variant="secondary">0.01%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Management Overview */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Overview of system users by role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { role: 'Students', count: 2456, percentage: 86, color: 'student' },
                  { role: 'Faculty', count: 378, percentage: 13, color: 'faculty' },
                  { role: 'Administrators', count: 13, percentage: 1, color: 'admin' }
                ].map((userType, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        userType.color === 'student' ? 'bg-student' :
                        userType.color === 'faculty' ? 'bg-faculty' : 'bg-admin'
                      }`} />
                      <span className="font-medium">{userType.role}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{userType.count}</span>
                      <Badge variant="secondary">{userType.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'High CPU Usage', description: 'Server load at 85%', severity: 'warning', time: '5 min ago' },
                  { title: 'Database Backup Complete', description: 'Daily backup successful', severity: 'success', time: '1 hour ago' },
                  { title: 'Failed Login Attempts', description: '3 failed attempts detected', severity: 'error', time: '2 hours ago' },
                  { title: 'System Update Available', description: 'Security patch ready', severity: 'info', time: '1 day ago' }
                ].map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      alert.severity === 'error' ? 'bg-destructive/10' :
                      alert.severity === 'warning' ? 'bg-warning/10' :
                      alert.severity === 'success' ? 'bg-success/10' : 'bg-primary/10'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        alert.severity === 'error' ? 'text-destructive' :
                        alert.severity === 'warning' ? 'text-warning' :
                        alert.severity === 'success' ? 'text-success' : 'text-primary'
                      }`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
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

export default AdminDashboard;