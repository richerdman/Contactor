import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";


type ButtonProps = {
    title: string;
    onPress: () => void;
    icon?: string;
    style?: ViewStyle;
};

export default function Button({ title, onPress, icon, style }: ButtonProps) {
    return (
        <TouchableOpacity 
            style={[styles.button, style]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>
                {icon && "${icon} "} {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: 8,
        minWidth: 100,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.medium,
        fontWeight: "600",
    },

});