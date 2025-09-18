import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, User, Users, Shield } from 'lucide-react';

const LoginSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="w-full max-w-4xl mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">EduPortal</h1>
          <p className="text-muted-foreground text-lg">Choose your login portal</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Student Login */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student-login')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-4 bg-blue-100 rounded-full">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-blue-800">Student Portal</CardTitle>
              <CardDescription>Access your courses, assignments, and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Login as Student
              </Button>
            </CardContent>
          </Card>

          {/* Teacher Login */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/teacher-login')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-4 bg-green-100 rounded-full">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-green-800">Teacher Portal</CardTitle>
              <CardDescription>Manage classes, assignments, and student progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Login as Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin-login')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-4 bg-purple-100 rounded-full">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-purple-800">Admin Portal</CardTitle>
              <CardDescription>System administration and user management</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginSelector;