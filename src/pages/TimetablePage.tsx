import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TimetablePage = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const { user } = useAuth();

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const classes = {
    'Monday': {
      '10:00 AM': { subject: 'Mathematics 101', instructor: 'Dr. Smith', room: 'Room 205', type: 'lecture' },
      '2:00 PM': { subject: 'Physics Lab', instructor: 'Prof. Johnson', room: 'Lab 3', type: 'lab' }
    },
    'Tuesday': {
      '9:00 AM': { subject: 'Computer Science', instructor: 'Dr. Wilson', room: 'Room 301', type: 'lecture' },
      '3:00 PM': { subject: 'Statistics', instructor: 'Prof. Davis', room: 'Room 102', type: 'lecture' }
    },
    'Wednesday': {
      '11:00 AM': { subject: 'Mathematics 101', instructor: 'Dr. Smith', room: 'Room 205', type: 'lecture' },
      '1:00 PM': { subject: 'Physics Fundamentals', instructor: 'Prof. Johnson', room: 'Room 401', type: 'lecture' }
    },
    'Thursday': {
      '10:00 AM': { subject: 'Computer Science', instructor: 'Dr. Wilson', room: 'Room 301', type: 'lecture' },
      '4:00 PM': { subject: 'Study Group', instructor: 'Self-study', room: 'Library', type: 'study' }
    },
    'Friday': {
      '9:00 AM': { subject: 'Statistics', instructor: 'Prof. Davis', room: 'Room 102', type: 'lecture' },
      '2:00 PM': { subject: 'Project Work', instructor: 'Team collaboration', room: 'Room 501', type: 'project' }
    }
  };

  const getClassTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-primary text-primary-foreground';
      case 'lab': return 'bg-faculty text-faculty-foreground';
      case 'study': return 'bg-muted text-muted-foreground';
      case 'project': return 'bg-admin text-admin-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">Your weekly class schedule</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedWeek === 'previous' ? 'default' : 'outline'}
            onClick={() => setSelectedWeek('previous')}
          >
            Previous Week
          </Button>
          <Button 
            variant={selectedWeek === 'current' ? 'default' : 'outline'}
            onClick={() => setSelectedWeek('current')}
          >
            Current Week
          </Button>
          <Button 
            variant={selectedWeek === 'next' ? 'outline' : 'outline'}
            onClick={() => setSelectedWeek('next')}
          >
            Next Week
          </Button>
        </div>
      </div>

      {/* Today's Classes Quick View - Only for Students */}
      {user?.role === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Classes
            </CardTitle>
            <CardDescription>Monday, October 23, 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(classes['Monday'] || {}).map(([time, classInfo]) => (
                <div key={time} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{classInfo.subject}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {classInfo.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {classInfo.instructor}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Complete timetable view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-2 min-w-[800px]">
              {/* Header */}
              <div className="p-3 font-semibold">Time</div>
              {weekDays.map(day => (
                <div key={day} className="p-3 font-semibold text-center">{day}</div>
              ))}

              {/* Time slots */}
              {timeSlots.map(time => (
                <div key={time} className="contents">
                  <div className="p-3 text-sm text-muted-foreground border-r">
                    {time}
                  </div>
                  {weekDays.map(day => {
                    const classInfo = classes[day as keyof typeof classes]?.[time];
                    return (
                      <div key={`${day}-${time}`} className="p-2 border border-border/50 min-h-[80px]">
                        {classInfo && (
                          <div className={`p-2 rounded text-xs ${getClassTypeColor(classInfo.type)} h-full`}>
                            <div className="font-medium truncate">{classInfo.subject}</div>
                            <div className="opacity-90 truncate">{classInfo.instructor}</div>
                            <div className="opacity-75 truncate">{classInfo.room}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-sm">Lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-faculty rounded"></div>
              <span className="text-sm">Laboratory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-admin rounded"></div>
              <span className="text-sm">Project Work</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <span className="text-sm">Study Group</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetablePage;