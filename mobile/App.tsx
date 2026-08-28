import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors, typography, spacing } from './src/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[PRAVAAH ErrorBoundary] Uncaught runtime error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>PRAVAAH Telemetry Alert</Text>
            <Text style={styles.errorMessage}>
              {this.state.error?.message || 'A temporary interface error occurred.'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Reload Interface</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthProvider>
          <NetworkProvider>
            <RootNavigator />
          </NetworkProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: colors.navyDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 360,
    width: '100%',
  },
  errorIcon: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  errorMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: colors.orange,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: spacing.radius.sm,
    marginTop: spacing.sm,
  },
  retryButtonText: {
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
});
