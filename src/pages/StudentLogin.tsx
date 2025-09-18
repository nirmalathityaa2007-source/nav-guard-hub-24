import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudentLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login, user } = useAuth();

  // Redirect if already authenticated as student
  if (isAuthenticated && user?.role === 'student') {
    return <Navigate to="/student-dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await login(email, password, 'student');
      
      if (result.success) {
        navigate('/student-dashboard');
      } else {
        setError(result.error || 'Invalid credentials for student login');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-blue-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-600 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-blue-800">Student Portal</CardTitle>
            <CardDescription>Sign in to access your student dashboard</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nirmal@123"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In as Student
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Student Credentials:</p>
            <p>Email: nirmal@123 | Password: 123</p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Not a student?{' '}
              <button 
                onClick={() => navigate('/teacher-login')} 
                className="text-blue-600 hover:underline"
              >
                Teacher Login
              </button>
              {' '}|{' '}
              <button 
                onClick={() => navigate('/admin-login')} 
                className="text-blue-600 hover:underline"
              >
                Admin Login
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLogin;