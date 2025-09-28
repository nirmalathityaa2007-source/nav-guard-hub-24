import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Mic, MicOff, VideoOff, Phone } from 'lucide-react';

interface JitsiMeetProps {
  roomName: string;
  displayName: string;
  userRole: 'student' | 'faculty' | 'admin';
  onJoinMeeting?: () => void;
  onLeaveMeeting?: () => void;
}

const JitsiMeet: React.FC<JitsiMeetProps> = ({
  roomName,
  displayName,
  userRole,
  onJoinMeeting,
  onLeaveMeeting
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    if (!jitsiContainerRef.current) return;

    // Clean up any existing instance
    if (apiRef.current) {
      apiRef.current.dispose();
    }

    // Configure Jitsi Meet options
    const options = {
      roomName: roomName || 'live-class-room',
      width: '100%',
      height: 400,
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: displayName || 'User',
        email: `${displayName?.toLowerCase().replace(' ', '.')}@school.edu`
      },
      configOverwrite: {
        startWithAudioMuted: userRole === 'student',
        startWithVideoMuted: false, // Always start with video enabled
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableModeratorIndicator: false,
        startScreenSharing: false,
        enableEmailInStats: false,
        enableClosePage: false,
        resolution: 720,
        constraints: {
          video: {
            aspectRatio: 16 / 9,
            height: { ideal: 720, max: 1080, min: 240 },
            width: { ideal: 1280, max: 1920, min: 320 }
          }
        },
        toolbarButtons: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
        ]
      },
      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: userRole === 'faculty',
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#1a1a1a',
        FILM_STRIP_MAX_HEIGHT: 120,
        ENABLE_FEEDBACK_ANIMATION: false,
        DISABLE_VIDEO_BACKGROUND: false,
        TOOLBAR_BUTTONS: userRole === 'faculty' ? [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'settings', 'raisehand', 'videoquality', 'filmstrip',
          'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'mute-everyone'
        ] : [
          'microphone', 'camera', 'closedcaptions', 'fullscreen',
          'hangup', 'chat', 'raisehand', 'settings', 'shortcuts'
        ]
      }
    };

    // Load Jitsi Meet API
    const script = document.createElement('script');
    script.src = 'https://8x8.vc/external_api.js';
    script.async = true;
    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        apiRef.current = new window.JitsiMeetExternalAPI('8x8.vc', options);

        // Event listeners
        apiRef.current.addEventListener('participantJoined', () => {
          onJoinMeeting?.();
        });

        apiRef.current.addEventListener('participantLeft', () => {
          onLeaveMeeting?.();
        });

        apiRef.current.addEventListener('videoConferenceLeft', () => {
          onLeaveMeeting?.();
        });
      }
    };

    if (!document.querySelector('script[src="https://8x8.vc/external_api.js"]')) {
      document.head.appendChild(script);
    } else if (window.JitsiMeetExternalAPI) {
      apiRef.current = new window.JitsiMeetExternalAPI('8x8.vc', options);
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomName, displayName, userRole, onJoinMeeting, onLeaveMeeting]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Live Class
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </Badge>
            {userRole === 'faculty' && (
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                Host
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={jitsiContainerRef} 
          className="w-full rounded-lg overflow-hidden border bg-gray-900"
          style={{ minHeight: '400px' }}
        />
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>• Room: {roomName}</p>
          <p>• Role: {userRole === 'faculty' ? 'Teacher (Host)' : 'Student'}</p>
          {userRole === 'faculty' && (
            <p>• You have moderator privileges to manage the class</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Extend window type for Jitsi
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default JitsiMeet;