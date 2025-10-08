-- Create enum for class types
CREATE TYPE public.class_type AS ENUM ('lecture', 'lab', 'study', 'project');

-- Create enum for days of week
CREATE TYPE public.day_of_week AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  room TEXT NOT NULL,
  class_type public.class_type NOT NULL DEFAULT 'lecture',
  day_of_week public.day_of_week NOT NULL,
  time_slot TEXT NOT NULL,
  needs_substitute BOOLEAN DEFAULT false,
  original_instructor TEXT,
  substitute_instructor TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view classes"
ON public.classes
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert classes"
ON public.classes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update classes"
ON public.classes
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete classes"
ON public.classes
FOR DELETE
TO authenticated
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.classes (subject, instructor_name, room, class_type, day_of_week, time_slot) VALUES
('Mathematics 101', 'Dr. Smith', 'Room 205', 'lecture', 'Monday', '10:00 AM'),
('Physics Lab', 'Prof. Johnson', 'Lab 3', 'lab', 'Monday', '2:00 PM'),
('Computer Science', 'Dr. Wilson', 'Room 301', 'lecture', 'Tuesday', '9:00 AM'),
('Statistics', 'Prof. Davis', 'Room 102', 'lecture', 'Tuesday', '3:00 PM'),
('Mathematics 101', 'Dr. Smith', 'Room 205', 'lecture', 'Wednesday', '11:00 AM'),
('Physics Fundamentals', 'Prof. Johnson', 'Room 401', 'lecture', 'Wednesday', '1:00 PM'),
('Computer Science', 'Dr. Wilson', 'Room 301', 'lecture', 'Thursday', '10:00 AM'),
('Study Group', 'Self-study', 'Library', 'study', 'Thursday', '4:00 PM'),
('Statistics', 'Prof. Davis', 'Room 102', 'lecture', 'Friday', '9:00 AM'),
('Project Work', 'Team collaboration', 'Room 501', 'project', 'Friday', '2:00 PM');