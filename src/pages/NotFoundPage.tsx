import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="space-y-4">
          <div className="text-6xl font-bold text-muted-foreground">404</div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            Sorry, we couldn't find the page you're looking for.
            <br />
            <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">
              {location.pathname}
            </code>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The page you requested might have been moved, deleted, or doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link 
                to="/student-dashboard" 
                className="text-primary hover:underline"
              >
                Student Dashboard
              </Link>
              <Link 
                to="/timetable" 
                className="text-primary hover:underline"
              >
                Timetable
              </Link>
              <Link 
                to="/my-classes" 
                className="text-primary hover:underline"
              >
                My Classes
              </Link>
              <Link 
                to="/assignments" 
                className="text-primary hover:underline"
              >
                Assignments
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;