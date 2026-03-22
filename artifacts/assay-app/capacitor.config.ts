import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.assayai.app',
  appName: 'ASSAY',
  webDir: 'dist/public',
  server: {
    url: 'https://assay-manager.replit.app',
    cleartext: false,
  },
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
