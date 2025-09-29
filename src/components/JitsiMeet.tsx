import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Mic, MicOff, VideoOff, Phone } from 'lucide-react';

interface JitsiMeetProps {
  roomName: string;
  displayName: string;
  userRole: 'student' | 'faculty' | 'admin';
  onJoinMeeting?: () => void;
  onLeaveMeeting?: () => void;
  onVideoStreamReady?: (stream: MediaStream) => void;
}

const JitsiMeet: React.FC<JitsiMeetProps> = ({
  roomName,
  displayName,
  userRole,
  onJoinMeeting,
  onLeaveMeeting,
  onVideoStreamReady
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const initializingRef = useRef(false);

  // Memoize Jitsi configuration to prevent unnecessary re-initializations
  const jitsiOptions = useMemo(() => ({
    roomName: roomName || 'live-class-room',
    width: '100%',
    height: 500,
    parentNode: jitsiContainerRef.current,
    userInfo: {
      displayName: displayName || 'User',
      email: `${displayName?.toLowerCase().replace(' ', '.')}@school.edu`
    },
    configOverwrite: {
      startWithAudioMuted: userRole === 'student',
      startWithVideoMuted: false,
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
          height: { ideal: 720, max: 1080, min: 480 },
          width: { ideal: 1280, max: 1920, min: 640 }
        }
      },
      disableDeepLinking: true,
      disableInviteFunctions: false,
      doNotStoreRoom: false,
      enableNoisyMicDetection: true,
      p2p: {
        enabled: true,
        stunServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    },
    interfaceConfigOverwrite: {
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      DEFAULT_BACKGROUND: '#000000',
      FILM_STRIP_MAX_HEIGHT: 120,
      ENABLE_FEEDBACK_ANIMATION: false,
      DISABLE_VIDEO_BACKGROUND: false,
      SHOW_CHROME_EXTENSION_BANNER: false,
      MOBILE_APP_PROMO: false,
      NATIVE_APP_NAME: 'EduPlatform Live Class',
      PROVIDER_NAME: 'EduPlatform',
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
  }), [roomName, displayName, userRole]);

  // Memoized callbacks to prevent re-renders
  const handleJoinMeeting = useCallback(() => {
    console.log('Participant joined meeting');
    onJoinMeeting?.();
  }, [onJoinMeeting]);

  const handleLeaveMeeting = useCallback(() => {
    console.log('Participant left meeting');
    onLeaveMeeting?.();
  }, [onLeaveMeeting]);

  const handleVideoStreamReady = useCallback((stream: MediaStream) => {
    console.log('Video stream ready for attention tracking');
    onVideoStreamReady?.(stream);
  }, [onVideoStreamReady]);

  // Initialize Jitsi only once to prevent video blinking
  const initializeJitsi = useCallback(() => {
    if (!jitsiContainerRef.current || initializingRef.current || apiRef.current) {
      return;
    }

    initializingRef.current = true;
    
    const options = {
      ...jitsiOptions,
      parentNode: jitsiContainerRef.current,
    };

    // Load Jitsi Meet API
    const script = document.createElement('script');
    script.src = 'https://8x8.vc/external_api.js';
    script.async = true;
    script.onload = () => {
      if (window.JitsiMeetExternalAPI && !apiRef.current) {
        try {
          apiRef.current = new window.JitsiMeetExternalAPI('8x8.vc', options);
          initializingRef.current = false;

          // Event listeners with memoized callbacks
          apiRef.current.addEventListener('participantJoined', handleJoinMeeting);
          apiRef.current.addEventListener('participantLeft', handleLeaveMeeting);
          apiRef.current.addEventListener('videoConferenceLeft', handleLeaveMeeting);

          // Get video stream for attention tracking (students only)
          if (userRole === 'student' && onVideoStreamReady) {
            apiRef.current.addEventListener('videoConferenceJoined', async () => {
              try {
                // Wait a bit for Jitsi to fully initialize
                setTimeout(async () => {
                  try {
                    const tracks = await apiRef.current?.getLocalTracks();
                    const videoTrack = tracks?.find((track: any) => track.getType() === 'video');
                    if (videoTrack) {
                      const stream = new MediaStream([videoTrack.track]);
                      handleVideoStreamReady(stream);
                    }
                  } catch (error) {
                    console.warn('Could not get video stream for attention tracking:', error);
                  }
                }, 2000);
              } catch (error) {
                console.warn('Error setting up video stream:', error);
              }
            });
          }
        } catch (error) {
          console.error('Error initializing Jitsi Meet:', error);
          initializingRef.current = false;
        }
      }
    };

    if (!document.querySelector('script[src="https://8x8.vc/external_api.js"]')) {
      document.head.appendChild(script);
    } else if (window.JitsiMeetExternalAPI && !apiRef.current) {
      try {
        apiRef.current = new window.JitsiMeetExternalAPI('8x8.vc', options);
        initializingRef.current = false;
      } catch (error) {
        console.error('Error initializing Jitsi Meet:', error);
        initializingRef.current = false;
      }
    }
  }, [jitsiOptions, userRole, handleJoinMeeting, handleLeaveMeeting, handleVideoStreamReady]);

  useEffect(() => {
    if (!jitsiContainerRef.current) return;

    // Clean up any existing instance
    if (apiRef.current) {
      apiRef.current.dispose();
      apiRef.current = null;
    }

    // Initialize Jitsi
    initializeJitsi();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
      initializingRef.current = false;
    };
  }, [initializeJitsi]);

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
          className="w-full rounded-lg overflow-hidden border bg-background"
          style={{ minHeight: '500px' }}
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