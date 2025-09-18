import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Lock, Shield, Users, Settings } from 'lucide-react';

const PermissionsPage = () => {
  const rolePermissions = {
    student: {
      name: 'Student',
      permissions: {
        'View Courses': true,
        'Submit Assignments': true,
        'Join Live Classes': true,
        'Access Resources': true,
        'View Progress': true,
        'Manage Users': false,
        'System Settings': false,
        'Generate Reports': false
      }
    },
    faculty: {
      name: 'Faculty',
      permissions: {
        'View Courses': true,
        'Submit Assignments': false,
        'Join Live Classes': true,
        'Access Resources': true,
        'View Progress': true,
        'Grade Assignments': true,
        'Manage Course Content': true,
        'View Analytics': true,
        'Generate Reports': true,
        'Manage Users': false,
        'System Settings': false
      }
    },
    admin: {
      name: 'Administrator',
      permissions: {
        'View Courses': true,
        'Submit Assignments': false,
        'Join Live Classes': true,
        'Access Resources': true,
        'View Progress': true,
        'Grade Assignments': true,
        'Manage Course Content': true,
        'View Analytics': true,
        'Generate Reports': true,
        'Manage Users': true,
        'System Settings': true,
        'User Permissions': true
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Permissions Management</h1>
        <p className="text-muted-foreground">Configure role-based access control and user permissions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active role types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protected Resources</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Secured endpoints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground">With assigned roles</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(rolePermissions).map(([roleKey, role]) => (
          <Card key={roleKey}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {role.name}
              </CardTitle>
              <CardDescription>
                Role-based permissions for {role.name.toLowerCase()} users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(role.permissions).map(([permission, enabled]) => (
                <div key={permission} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{permission}</span>
                  <Switch checked={enabled} disabled />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Global security and access control settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold">Authentication</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require Strong Passwords</span>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Two-Factor Authentication</span>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session Timeout (30 min)</span>
                  <Switch checked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Access Control</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">IP Address Restrictions</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Device Registration Required</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Audit Logging</span>
                  <Switch checked />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button>Save Changes</Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsPage;