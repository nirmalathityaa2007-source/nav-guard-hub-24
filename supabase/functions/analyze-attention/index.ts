import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentId, frameData, detectionData } = await req.json();

    if (!studentId || !frameData) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: studentId and frameData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing attention for student: ${studentId}`);

    // Advanced multi-factor attention analysis
    let attentionScore = 0;

    if (detectionData && detectionData.faceDetected) {
      const {
        eyeAspectRatio,
        gazeDirection,
        headPose,
        blinkRate,
        movementStability,
        eyesOpenDuration,
        lookingAtScreenConfidence
      } = detectionData;

      // Eyes closed = no attention
      if (eyeAspectRatio.left < 0.2 && eyeAspectRatio.right < 0.2) {
        attentionScore = 0;
      } else {
        // Multi-factor weighted scoring system
        let score = 0;
        
        // Factor 1: Looking at screen confidence (35% weight)
        score += lookingAtScreenConfidence * 35;
        
        // Factor 2: Head pose alignment (25% weight)
        const yawPenalty = Math.abs(headPose.yaw) / 45; // 0-1 penalty
        const pitchPenalty = Math.abs(headPose.pitch) / 30; // 0-1 penalty
        const rollPenalty = Math.abs(headPose.roll) / 20; // 0-1 penalty
        const headPoseScore = Math.max(0, 1 - yawPenalty - pitchPenalty - (rollPenalty * 0.5));
        score += headPoseScore * 25;
        
        // Factor 3: Eye openness and quality (15% weight)
        const avgEAR = (eyeAspectRatio.left + eyeAspectRatio.right) / 2;
        const eyeScore = Math.min(1, avgEAR / 0.3); // Normalized to 0.3 as max
        score += eyeScore * 15;
        
        // Factor 4: Movement stability (10% weight)
        score += movementStability * 10;
        
        // Factor 5: Blink rate health (10% weight)
        // Normal blink rate: 12-20 per minute
        let blinkScore = 1.0;
        if (blinkRate < 8) blinkScore = 0.6; // Too few blinks = distracted
        else if (blinkRate > 30) blinkScore = 0.5; // Too many = fatigue
        else if (blinkRate >= 12 && blinkRate <= 20) blinkScore = 1.0; // Optimal
        else blinkScore = 0.8; // Acceptable
        score += blinkScore * 10;
        
        // Factor 6: Sustained attention duration (5% weight)
        const sustainedScore = Math.min(1, eyesOpenDuration / 60); // Max at 60 seconds
        score += sustainedScore * 5;
        
        // Additional penalties
        // Penalty for extreme gaze deviation
        const gazeDeviation = Math.sqrt(
          gazeDirection.horizontal ** 2 + gazeDirection.vertical ** 2
        );
        if (gazeDeviation > 3) {
          score *= 0.85; // 15% penalty for looking away
        }
        
        // Penalty for head tilted too much
        if (Math.abs(headPose.roll) > 15) {
          score *= 0.9; // 10% penalty for tilted head
        }
        
        // Bonus for perfect attention
        if (lookingAtScreenConfidence > 0.9 && headPoseScore > 0.9 && movementStability > 0.8) {
          score = Math.min(100, score * 1.05); // 5% bonus
        }
        
        attentionScore = Math.round(Math.max(0, Math.min(100, score)));
      }
    } else {
      // No face detected
      attentionScore = 0;
    }

    console.log(`Attention score calculated: ${attentionScore}`);

    // Store in database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: insertError } = await supabaseClient
      .from('attention_logs')
      .insert({
        student_id: studentId,
        attention_score: attentionScore,
        timestamp: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting attention log:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ attention_score: attentionScore }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-attention function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
