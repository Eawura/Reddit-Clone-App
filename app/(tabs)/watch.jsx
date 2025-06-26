import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PopupMenu from '../../components/PopupMenu';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';

const Header = ({ menuOpen, setMenuOpen, onProfilePress }) => {
    const router = useRouter();
    const { themeColors } = useTheme();
    return (
        <View style={[styles.header, { backgroundColor: themeColors.background }] }>
            <View style={styles.headerLeft}>
            <TouchableOpacity>
                <Feather name="menu" size={28} color={themeColors.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
                <Text style={[styles.logoText, { color: '#2E45A3' } ]}>Watch</Text>
                <Ionicons name={menuOpen ? "chevron-up" : "chevron-down"} size={18} color={themeColors.icon} />
            </TouchableOpacity>
            </View>
            <View style={styles.headerIcons}>
            <TouchableOpacity style={{marginRight: 16}}>
                <Ionicons name="search" size={24} color={themeColors.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onProfilePress}>
                <Ionicons name="person-circle-outline" size={28} color={themeColors.icon} />
            </TouchableOpacity>
            </View>
        </View>
    )
};

const Watch = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [lastTabPath, setLastTabPath] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => { setLastTabPath(pathname); setProfileModalVisible(true); }} />
            <PopupMenu visible={menuOpen} router={router} />
            <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onLogout={() => { setProfileModalVisible(false); if (lastTabPath) router.replace(lastTabPath); }} lastTabPath={lastTabPath} />
            <View style={styles.content}>
                <Text style={styles.title}>There is no content to display</Text>
                <Text style={styles.subtitle}>We were unable to find any content for this page</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DAE0E6',
    },
    header: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        color: '#2E45A3',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 8,
        marginLeft: 6,
    },
    subtitle: {
        fontWeight: '500',
        fontSize: 16,
        marginLeft: 6,
    },
});

export default Watch; 