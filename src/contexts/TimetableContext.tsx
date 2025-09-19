import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ClassInfo {
  id: string;
  subject: string;
  instructor: string;
  room: string;
  type: string;
  originalInstructor?: string;
  isSubstitute?: boolean;
  needsSubstitute?: boolean;
}

export interface TimetableState {
  [day: string]: {
    [time: string]: ClassInfo;
  };
}

interface TimetableContextType {
  timetable: TimetableState;
  markUnavailable: (day: string, time: string, instructorId: string) => void;
  takeOverClass: (day: string, time: string, newInstructor: string) => void;
  getClassesNeedingSubstitute: () => Array<{ day: string; time: string; classInfo: ClassInfo }>;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

const initialTimetable: TimetableState = {
  'Monday': {
    '10:00 AM': { id: '1', subject: 'Mathematics 101', instructor: 'Dr. Smith', room: 'Room 205', type: 'lecture' },
    '2:00 PM': { id: '2', subject: 'Physics Lab', instructor: 'Prof. Johnson', room: 'Lab 3', type: 'lab' }
  },
  'Tuesday': {
    '9:00 AM': { id: '3', subject: 'Computer Science', instructor: 'Dr. Wilson', room: 'Room 301', type: 'lecture' },
    '3:00 PM': { id: '4', subject: 'Statistics', instructor: 'Prof. Davis', room: 'Room 102', type: 'lecture' }
  },
  'Wednesday': {
    '11:00 AM': { id: '5', subject: 'Mathematics 101', instructor: 'Dr. Smith', room: 'Room 205', type: 'lecture' },
    '1:00 PM': { id: '6', subject: 'Physics Fundamentals', instructor: 'Prof. Johnson', room: 'Room 401', type: 'lecture' }
  },
  'Thursday': {
    '10:00 AM': { id: '7', subject: 'Computer Science', instructor: 'Dr. Wilson', room: 'Room 301', type: 'lecture' },
    '4:00 PM': { id: '8', subject: 'Study Group', instructor: 'Self-study', room: 'Library', type: 'study' }
  },
  'Friday': {
    '9:00 AM': { id: '9', subject: 'Statistics', instructor: 'Prof. Davis', room: 'Room 102', type: 'lecture' },
    '2:00 PM': { id: '10', subject: 'Project Work', instructor: 'Team collaboration', room: 'Room 501', type: 'project' }
  }
};

export const TimetableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timetable, setTimetable] = useState<TimetableState>(initialTimetable);

  const markUnavailable = (day: string, time: string, instructorId: string) => {
    setTimetable(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: {
          ...prev[day][time],
          needsSubstitute: true,
          originalInstructor: prev[day][time].instructor
        }
      }
    }));
  };

  const takeOverClass = (day: string, time: string, newInstructor: string) => {
    setTimetable(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: {
          ...prev[day][time],
          instructor: newInstructor,
          isSubstitute: true,
          needsSubstitute: false
        }
      }
    }));
  };

  const getClassesNeedingSubstitute = () => {
    const needingSubstitute: Array<{ day: string; time: string; classInfo: ClassInfo }> = [];
    
    Object.entries(timetable).forEach(([day, daySchedule]) => {
      Object.entries(daySchedule).forEach(([time, classInfo]) => {
        if (classInfo.needsSubstitute) {
          needingSubstitute.push({ day, time, classInfo });
        }
      });
    });
    
    return needingSubstitute;
  };

  return (
    <TimetableContext.Provider value={{
      timetable,
      markUnavailable,
      takeOverClass,
      getClassesNeedingSubstitute
    }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};