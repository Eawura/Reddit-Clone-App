import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PopupMenu from '../../components/PopupMenu';

const Header = ({ menuOpen, setMenuOpen }) => {
    const router = useRouter();
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
            <TouchableOpacity>
                <Feather name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
                <Text style={styles.logoText}>Watch</Text>
                <Ionicons name={menuOpen ? "chevron-up" : "chevron-down"} size={18} color="#fff" />
            </TouchableOpacity>
            </View>
            <View style={styles.headerIcons}>
            <TouchableOpacity style={{marginRight: 16}}>
                <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons name="person-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
            </View>
        </View>
    )
  };

const Watch = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <PopupMenu visible={menuOpen} router={router} />
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