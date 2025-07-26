import { Feather, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MoreMenu({ visible, onClose, onReport, onHide, onCopyLink, onShare }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={onReport}>
          <MaterialIcons name="report" size={22} color="#e74c3c" style={{ marginRight: 12 }} />
          <Text style={styles.menuText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onHide}>
          <Feather name="eye-off" size={22} color="#888" style={{ marginRight: 12 }} />
          <Text style={styles.menuText}>Hide Post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onCopyLink}>
          <Feather name="link" size={22} color="#2E45A3" style={{ marginRight: 12 }} />
          <Text style={styles.menuText}>Copy Link</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onShare}>
          <Feather name="share-2" size={22} color="#2E45A3" style={{ marginRight: 12 }} />
          <Text style={styles.menuText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: '#eee' }]} onPress={onClose}>
          <Text style={[styles.menuText, { color: '#888' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 