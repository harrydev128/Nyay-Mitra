import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface QuickActionCardProps {
    action: {
        icon: string;
        title: string;
        color: string;
        route: any;
    };
    Colors: any;
    onPress: (route: any) => void;
}

const QuickActionCard = React.memo(({ action, Colors, onPress }: QuickActionCardProps) => (
    <Pressable
        style={({ pressed }) => [
            styles.quickActionCard,
            { backgroundColor: Colors.cardBackground },
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => onPress(action.route)}
    >
        <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
            <Ionicons name={action.icon as any} size={24} color={Colors.white} />
        </View>
        <Text style={[styles.quickActionText, { color: Colors.textPrimary }]} numberOfLines={2}>
            {action.title}
        </Text>
    </Pressable>
));
QuickActionCard.displayName = 'QuickActionCard';

const styles = StyleSheet.create({
    quickActionCard: {
        width: (width - 44) / 2,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    quickActionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    quickActionText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
});

export default QuickActionCard;
