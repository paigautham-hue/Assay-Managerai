import type { CapacitorConfig } from '@capacitor/cli';

// For native iOS/iPad builds, set ASSAY_SERVER_URL to your deployed backend.
// For development, use your Mac's local IP (e.g., http://192.168.1.100:8080).
// When not set, the app serves from local dist (PWA mode, no API connectivity).
const serverUrl = process.env.ASSAY_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.assayai.app',
  appName: 'ASSAY',
  webDir: 'dist/public',
  ...(serverUrl ? {
    server: {
      url: serverUrl,
      cleartext: serverUrl.startsWith('http://'),
      allowNavigation: [
        'accounts.google.com',  // Google OAuth
        '*.manus.space',        // Manus deployment
      ],
    },
  } : {}),
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'assay',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: '#0D0D1A',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0D0D1A',
    },
    Keyboard: {
      resize: 'ionic',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
