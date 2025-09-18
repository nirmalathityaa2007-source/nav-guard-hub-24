import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Server, Database, Mail, Globe, Shield } from 'lucide-react';

const SystemSettingsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and system preferences</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Online</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Uptime this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Level</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">High</div>
            <p className="text-xs text-muted-foreground">All checks passed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="EduPortal Learning Management System" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input id="siteUrl" defaultValue="https://eduportal.university.edu" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Maintenance Mode</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">User Registration</span>
                <Switch checked />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Email Notifications</span>
                <Switch checked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtpServer">SMTP Server</Label>
              <Input id="smtpServer" defaultValue="smtp.university.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" defaultValue="587" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input id="fromEmail" defaultValue="noreply@university.edu" />
            </div>
            <Button variant="outline">Test Email Configuration</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Upload Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
              <Input id="maxFileSize" defaultValue="50" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedTypes">Allowed File Types</Label>
              <Input id="allowedTypes" defaultValue="pdf,doc,docx,jpg,png,mp4" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Virus Scanning</span>
              <Switch checked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup & Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Last Backup</span>
                <Badge variant="outline">2 hours ago</Badge>
              </div>
              <div className="flex justify-between">
                <span>Backup Frequency</span>
                <Badge variant="secondary">Daily</Badge>
              </div>
              <div className="flex justify-between">
                <span>Storage Used</span>
                <Badge variant="outline">2.4 GB</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">Create Manual Backup</Button>
              <Button variant="outline" className="w-full">Download System Logs</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Save Changes</CardTitle>
          <CardDescription>Apply your configuration changes to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button>Save All Settings</Button>
            <Button variant="outline">Reset to Defaults</Button>
            <Button variant="destructive">Restart System</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettingsPage;