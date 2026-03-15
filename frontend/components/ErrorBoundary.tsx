import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to an error reporting service if needed
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.emoji}>⚠️</Text>
                    <Text style={styles.title}>
                        कुछ गड़बड़ हो गई
                    </Text>
                    <Text style={styles.subtitle}>
                        ऐप को रीफ्रेश करें
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.setState({ hasError: false, error: null })}
                    >
                        <Text style={styles.buttonText}>पुनः प्रयास करें</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    emoji: {
        fontSize: 48,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    button: {
        backgroundColor: '#FF6B00',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ErrorBoundary;
