import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Modal, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageModal = ({ visible, imageSource, onClose, themeColors }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden={true} />
      <TouchableOpacity
        style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.9)' }]}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Close Button */}
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        {/* Full Screen Image */}
        <Image
          source={imageSource}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  imageContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: screenWidth,
    height: screenHeight,
  },
});

export default ImageModal; 