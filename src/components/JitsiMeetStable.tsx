import { useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Users } from 'lucide-react';
import JitsiManager from '@/lib/jitsiManager';

interface JitsiMeetStableProps {
  roomName: string;
  displayName: string;
  userRole: 'student' | 'faculty' | 'admin';
  onJoinMeeting?: () => void;
  onLeaveMeeting?: () => void;
  onVideoStreamReady?: (stream: MediaStream) => void;
}

const JitsiMeetStable: React.FC<JitsiMeetStableProps> = ({
  roomName,
  displayName,
  userRole,
  onJoinMeeting,
  onLeaveMeeting,
  onVideoStreamReady
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiManager = JitsiManager.getInstance();
  const listenersSetup = useRef(false);

  // Stable event handlers
  const handleJoinMeeting = useCallback(() => {
    console.log('Participant joined meeting');
    onJoinMeeting?.();
  }, [onJoinMeeting]);

  const handleLeaveMeeting = useCallback(() => {
    console.log('Participant left meeting');
    onLeaveMeeting?.();
  }, [onLeaveMeeting]);

  const handleVideoConferenceJoined = useCallback(async () => {
    console.log('Video conference joined');
    
    // Get video stream for attention tracking (students only)
    if (userRole === 'student' && onVideoStreamReady) {
      try {
        // Wait for Jitsi to fully initialize
        setTimeout(async () => {
          try {
            const tracks = await jitsiManager.getLocalTracks();
            const videoTrack = tracks?.find((track: any) => track.getType() === 'video');
            if (videoTrack) {
              const stream = new MediaStream([videoTrack.track]);
              console.log('Video stream ready for attention tracking');
              onVideoStreamReady(stream);
            }
          } catch (error) {
            console.warn('Could not get video stream for attention tracking:', error);
          }
        }, 2000);
      } catch (error) {
        console.warn('Error setting up video stream:', error);
      }
    }
  }, [userRole, onVideoStreamReady, jitsiManager]);

  // Setup event listeners only once
  const setupEventListeners = useCallback(() => {
    if (listenersSetup.current) return;
    
    jitsiManager.addEventListener('participantJoined', handleJoinMeeting);
    jitsiManager.addEventListener('participantLeft', handleLeaveMeeting);
    jitsiManager.addEventListener('videoConferenceLeft', handleLeaveMeeting);
    jitsiManager.addEventListener('videoConferenceJoined', handleVideoConferenceJoined);
    
    listenersSetup.current = true;
  }, [jitsiManager, handleJoinMeeting, handleLeaveMeeting, handleVideoConferenceJoined]);

  // Initialize Jitsi once with stable configuration
  useEffect(() => {
    const initializeJitsi = async () => {
      if (!containerRef.current) return;

      const options = {
        roomName: roomName || 'live-class-room',
        width: '100%',
        height: 500,
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
      };

      try {
        await jitsiManager.initialize(options, containerRef.current);
        setupEventListeners();
        console.log('Jitsi initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Jitsi:', error);
      }
    };

    initializeJitsi();

    // Cleanup function
    return () => {
      if (listenersSetup.current) {
        jitsiManager.removeEventListener('participantJoined', handleJoinMeeting);
        jitsiManager.removeEventListener('participantLeft', handleLeaveMeeting);
        jitsiManager.removeEventListener('videoConferenceLeft', handleLeaveMeeting);
        jitsiManager.removeEventListener('videoConferenceJoined', handleVideoConferenceJoined);
        listenersSetup.current = false;
      }
    };
  }, []); // Empty dependency array - initialize only once

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Only dispose if this is the last component using Jitsi
      // In a real app, you might want more sophisticated cleanup logic
    };
  }, []);

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
          ref={containerRef} 
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

export default JitsiMeetStable;