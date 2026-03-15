import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickSolCardProps {
    sol: {
        emoji: string;
        title: string;
        message: string;
    };
    Colors: any;
    getText: (hi: string, en: string) => string;
    onPress: (message: string) => void;
}

const QuickSolCard = React.memo(({ sol, Colors, getText, onPress }: QuickSolCardProps) => (
    <Pressable
        style={({ pressed }) => [
            styles.quickSolCard,
            { backgroundColor: Colors.cardBackground },
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => onPress(sol.message)}
    >
        <Text style={styles.quickSolEmoji}>{sol.emoji}</Text>
        <Text style={[styles.quickSolText, { color: Colors.textPrimary }]} numberOfLines={3}>{sol.title}</Text>
        <View style={styles.quickSolArrow}>
            <Ionicons name="chatbubble-ellipses" size={16} color={Colors.saffron} />
            <Text style={[styles.quickSolAction, { color: Colors.saffron }]}>{getText('AI से पूछें', 'Ask AI')}</Text>
        </View>
    </Pressable>
));
QuickSolCard.displayName = 'QuickSolCard';

const styles = StyleSheet.create({
    quickSolCard: {
        width: 180,
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    quickSolEmoji: { fontSize: 32, marginBottom: 8 },
    quickSolText: { fontSize: 13, fontWeight: '600', lineHeight: 18, marginBottom: 10 },
    quickSolArrow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    quickSolAction: { fontSize: 12, fontWeight: '600' },
});

export default QuickSolCard;
