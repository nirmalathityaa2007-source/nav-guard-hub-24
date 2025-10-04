import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Video, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTimetable } from '@/contexts/TimetableContext';
import SubstituteManager from '@/components/SubstituteManager';

const TimetablePage = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const { user } = useAuth();
  const { timetable, markUnavailable } = useTimetable();

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleMarkUnavailable = (day: string, time: string) => {
    if (user) {
      markUnavailable(day, time, user.name || 'current-user');
    }
  };

  const getClassTypeColor = (type: string, needsSubstitute?: boolean, isSubstitute?: boolean) => {
    if (needsSubstitute) return 'bg-red-100 text-red-700 border-red-200';
    if (isSubstitute) return 'bg-green-100 text-green-700 border-green-200';
    
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

      {/* Substitute Manager - Only for Faculty */}
      {user?.role === 'faculty' && <SubstituteManager />}

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
              {Object.entries(timetable['Monday'] || {}).map(([time, classInfo]) => (
                <div key={time} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{classInfo.subject}</h4>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {classInfo.room}
                        </span>
                      </div>
                      {classInfo.needsSubstitute ? (
                        <span className="flex items-center gap-1 text-red-600">
                          <UserX className="h-3 w-3" />
                          {classInfo.originalInstructor} for {classInfo.subject} is not available
                        </span>
                      ) : classInfo.isSubstitute ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-orange-600 line-through opacity-70">
                            <UserX className="h-3 w-3" />
                            {classInfo.originalInstructor} not available
                          </span>
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <User className="h-3 w-3" />
                            {classInfo.instructor} (Substitute)
                          </span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {classInfo.instructor}
                        </span>
                      )}
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
                    const classInfo = timetable[day as keyof typeof timetable]?.[time];
                    const isUserClass = user?.role === 'faculty' && classInfo && (
                      classInfo.instructor === user.name || 
                      classInfo.originalInstructor === user.name
                    );
                    
                    return (
                      <div key={`${day}-${time}`} className="p-2 border border-border/50 min-h-[80px] relative">
                        {classInfo && (
                          <>
                            <div className={`p-2 rounded text-xs ${getClassTypeColor(classInfo.type, classInfo.needsSubstitute, classInfo.isSubstitute)} h-full border`}>
                              <div className="font-medium truncate">{classInfo.subject}</div>
                              {classInfo.needsSubstitute ? (
                                <div className="opacity-90 text-xs">
                                  <div className="font-medium text-red-700 truncate">{classInfo.originalInstructor}</div>
                                  <div className="text-red-600">Not Available</div>
                                </div>
                              ) : classInfo.isSubstitute ? (
                                <div className="opacity-90 text-xs space-y-0.5">
                                  <div className="line-through opacity-60 truncate">{classInfo.originalInstructor}</div>
                                  <div className="font-medium text-green-700 truncate">{classInfo.instructor}</div>
                                  <Badge variant="outline" className="text-xs px-1 py-0">Substitute</Badge>
                                </div>
                              ) : (
                                <div className="opacity-90 truncate">{classInfo.instructor}</div>
                              )}
                              <div className="opacity-75 truncate">{classInfo.room}</div>
                            </div>
                            {user?.role === 'faculty' && isUserClass && !classInfo.needsSubstitute && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-red-100"
                                onClick={() => handleMarkUnavailable(day, time)}
                                title="Mark as unavailable"
                              >
                                <UserX className="h-3 w-3 text-red-600" />
                              </Button>
                            )}
                          </>
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
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm">Needs Substitute</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm">Substitute Teacher</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetablePage;