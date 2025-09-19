import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCheck, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { useTimetable } from '@/contexts/TimetableContext';
import { useAuth } from '@/contexts/AuthContext';

const SubstituteManager = () => {
  const { getClassesNeedingSubstitute, takeOverClass } = useTimetable();
  const { user } = useAuth();
  const classesNeedingSubstitute = getClassesNeedingSubstitute();

  const handleTakeOver = (day: string, time: string) => {
    if (user) {
      takeOverClass(day, time, user.name || 'Current User');
    }
  };

  if (classesNeedingSubstitute.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="h-5 w-5" />
          Classes Needing Substitute
        </CardTitle>
        <CardDescription>
          The following classes need substitute teachers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classesNeedingSubstitute.map(({ day, time, classInfo }) => (
            <Alert key={`${day}-${time}`} className="border-orange-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-semibold">{classInfo.subject}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {day}, {time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {classInfo.room}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Original: {classInfo.originalInstructor}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleTakeOver(day, time)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Take Over
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubstituteManager;