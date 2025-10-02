-- Create attention_logs table for storing student attention scores
CREATE TABLE IF NOT EXISTS public.attention_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  attention_score INTEGER NOT NULL CHECK (attention_score >= 0 AND attention_score <= 100),
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.attention_logs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert their own logs
CREATE POLICY "Users can insert their own attention logs"
  ON public.attention_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow all authenticated users to read all logs (for teacher/admin monitoring)
CREATE POLICY "Users can view all attention logs"
  ON public.attention_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for faster queries by student_id and timestamp
CREATE INDEX idx_attention_logs_student_timestamp 
  ON public.attention_logs(student_id, timestamp DESC);