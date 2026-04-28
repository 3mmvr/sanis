import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

// Replace this with your local machine's IP address if it changes
// Run 'ipconfig getifaddr en0' on Mac to find it.
const LOCAL_IP = '192.168.0.126'; 
const DEV_URL = `http://${LOCAL_IP}:3000`;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1A202C" />
      
      <View style={styles.webviewContainer}>
        <WebView 
          source={{ uri: DEV_URL }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setError(`Failed to connect to dev server at ${DEV_URL}. \n\nMake sure your computer and phone are on the same Wi-Fi and that the Vite server is running with the --host flag.`);
            setIsLoading(false);
          }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#F3A528" />
            <Text style={styles.loadingText}>Connecting to SANIS...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A202C', // Dark background to match app
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#1A202C',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A202C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A202C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 10,
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
