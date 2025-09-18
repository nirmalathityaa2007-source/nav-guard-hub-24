import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Home, LogIn } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-full">
              <ShieldX className="w-12 h-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This page requires specific permissions that your account doesn't have. 
            Please contact your administrator if you believe this is an error.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/student-dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In Again
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Contact your system administrator or IT support team for assistance 
              with account permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;