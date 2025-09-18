import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TeacherLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login, user } = useAuth();

  // Redirect if already authenticated as faculty
  if (isAuthenticated && user?.role === 'faculty') {
    return <Navigate to="/faculty-dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await login(email, password, 'faculty');
      
      if (result.success) {
        navigate('/faculty-dashboard');
      } else {
        setError(result.error || 'Invalid credentials for teacher login');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-green-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-green-600 rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-green-800">Teacher Portal</CardTitle>
            <CardDescription>Sign in to access your faculty dashboard</CardDescription>
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
                placeholder="teacher@123"
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

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In as Teacher
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Teacher Credentials:</p>
            <p>Email: teacher@123 | Password: teacher123</p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Not a teacher?{' '}
              <button 
                onClick={() => navigate('/student-login')} 
                className="text-green-600 hover:underline"
              >
                Student Login
              </button>
              {' '}|{' '}
              <button 
                onClick={() => navigate('/admin-login')} 
                className="text-green-600 hover:underline"
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

export default TeacherLogin;