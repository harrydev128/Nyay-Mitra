import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HelplineCardProps {
    helpline: {
        name: string;
        number: string;
        icon: string;
    };
    Colors: any;
    onPress: (number: string) => void;
}

const HelplineCard = React.memo(({ helpline, Colors, onPress }: HelplineCardProps) => (
    <Pressable
        style={({ pressed }) => [
            styles.helplineCard,
            { backgroundColor: Colors.cardBackground },
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => onPress(helpline.number)}
    >
        <Ionicons name={`${helpline.icon}-outline` as any} size={20} color={Colors.red} />
        <Text style={[styles.helplineNumber, { color: Colors.red }]}>{helpline.number}</Text>
        <Text style={[styles.helplineName, { color: Colors.textSecondary }]}>{helpline.name}</Text>
    </Pressable>
));
HelplineCard.displayName = 'HelplineCard';

const styles = StyleSheet.create({
    helplineCard: {
        width: 110,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },
    helplineNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 6 },
    helplineName: { fontSize: 10, marginTop: 2, fontWeight: '600' },
});

export default HelplineCard;
