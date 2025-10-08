import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  MapPin, 
  AlertCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ClassData {
  id: string;
  subject: string;
  instructor_name: string;
  room: string;
  class_type: 'lecture' | 'lab' | 'study' | 'project';
  day_of_week: string;
  time_slot: string;
  needs_substitute: boolean;
  original_instructor: string | null;
  substitute_instructor: string | null;
  is_active: boolean;
}

interface DayStats {
  day: string;
  count: number;
}

interface TimeSlotStats {
  timeSlot: string;
  count: number;
}

interface ClassTypeStats {
  type: string;
  count: number;
  percentage: number;
}

const ClassAnalyticsDashboard = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    needingSubstitute: 0,
    uniqueInstructors: 0,
    uniqueRooms: 0
  });
  const [dayStats, setDayStats] = useState<DayStats[]>([]);
  const [timeSlotStats, setTimeSlotStats] = useState<TimeSlotStats[]>([]);
  const [classTypeStats, setClassTypeStats] = useState<ClassTypeStats[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('time_slot', { ascending: true });

      if (error) throw error;

      if (data) {
        setClasses(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: ClassData[]) => {
    // Basic stats
    const totalClasses = data.length;
    const activeClasses = data.filter(c => c.is_active).length;
    const needingSubstitute = data.filter(c => c.needs_substitute).length;
    const uniqueInstructors = new Set(data.map(c => c.instructor_name)).size;
    const uniqueRooms = new Set(data.map(c => c.room)).size;

    setStats({
      totalClasses,
      activeClasses,
      needingSubstitute,
      uniqueInstructors,
      uniqueRooms
    });

    // Day-wise distribution
    const dayCount = data.reduce((acc, cls) => {
      acc[cls.day_of_week] = (acc[cls.day_of_week] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dayStatsArray = Object.entries(dayCount).map(([day, count]) => ({
      day,
      count
    }));
    setDayStats(dayStatsArray);

    // Time slot distribution
    const timeCount = data.reduce((acc, cls) => {
      acc[cls.time_slot] = (acc[cls.time_slot] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timeStatsArray = Object.entries(timeCount)
      .map(([timeSlot, count]) => ({
        timeSlot,
        count
      }))
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    setTimeSlotStats(timeStatsArray);

    // Class type distribution
    const typeCount = data.reduce((acc, cls) => {
      acc[cls.class_type] = (acc[cls.class_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeStatsArray = Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalClasses) * 100)
    }));
    setClassTypeStats(typeStatsArray);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Loading class analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Across all periods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClasses}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Substitute</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.needingSubstitute}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <Users className="h-4 w-4 text-faculty" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueInstructors}</div>
            <p className="text-xs text-muted-foreground">Unique faculty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rooms</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueRooms}</div>
            <p className="text-xs text-muted-foreground">In use</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Day-wise Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Classes by Day
            </CardTitle>
            <CardDescription>Distribution across the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dayStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-24 font-medium">{stat.day}</div>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[200px]">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${(stat.count / stats.totalClasses) * 100}%` }}
                    />
                  </div>
                </div>
                <Badge variant="secondary">{stat.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time Slot Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Classes by Time Slot
            </CardTitle>
            <CardDescription>Peak and off-peak periods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeSlotStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-24 font-medium text-sm">{stat.timeSlot}</div>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[200px]">
                    <div 
                      className="h-full bg-faculty"
                      style={{ width: `${(stat.count / stats.totalClasses) * 100}%` }}
                    />
                  </div>
                </div>
                <Badge variant="secondary">{stat.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Class Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Class Types
            </CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {classTypeStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-20 font-medium capitalize">{stat.type}</div>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[200px]">
                    <div 
                      className="h-full bg-student"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{stat.count}</span>
                  <Badge variant="secondary">{stat.percentage}%</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Classes Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Needs Attention
            </CardTitle>
            <CardDescription>Classes requiring substitutes</CardDescription>
          </CardHeader>
          <CardContent>
            {classes.filter(c => c.needs_substitute).length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes need substitutes</p>
            ) : (
              <div className="space-y-3">
                {classes.filter(c => c.needs_substitute).map((cls) => (
                  <div key={cls.id} className="border-l-2 border-warning pl-3">
                    <div className="font-medium">{cls.subject}</div>
                    <div className="text-sm text-muted-foreground">
                      {cls.day_of_week} at {cls.time_slot}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Original: {cls.original_instructor}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Class List */}
      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>Complete schedule overview</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.subject}</TableCell>
                  <TableCell>
                    {cls.needs_substitute && cls.original_instructor ? (
                      <div className="space-y-1">
                        <div className="line-through text-muted-foreground text-sm">
                          {cls.original_instructor}
                        </div>
                        {cls.substitute_instructor && (
                          <div className="text-sm text-success">
                            {cls.substitute_instructor}
                          </div>
                        )}
                      </div>
                    ) : (
                      cls.instructor_name
                    )}
                  </TableCell>
                  <TableCell>{cls.day_of_week}</TableCell>
                  <TableCell>{cls.time_slot}</TableCell>
                  <TableCell>{cls.room}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {cls.class_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cls.needs_substitute ? (
                      <Badge variant="destructive">Needs Substitute</Badge>
                    ) : cls.is_active ? (
                      <Badge variant="secondary">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassAnalyticsDashboard;
