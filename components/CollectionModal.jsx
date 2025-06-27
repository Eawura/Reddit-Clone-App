import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from './BookmarkContext';

export default function CollectionModal({ visible, onClose, post }) {
  const {
    collections,
    addBookmark,
    removeBookmark,
    isBookmarked,
    createCollection,
    DEFAULT_COLLECTION,
  } = useBookmarks();
  const [newCollection, setNewCollection] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    const name = newCollection.trim();
    if (!name) return;
    if (collections[name]) {
      setError('Collection already exists');
      return;
    }
    createCollection(name);
    setNewCollection('');
    setError('');
  };

  const handleToggle = (collection) => {
    if (isBookmarked(post.id, collection)) {
      removeBookmark(post.id, collection);
    } else {
      addBookmark(post, collection);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Save to Collection</Text>
          <FlatList
            data={Object.keys(collections)}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.collectionItem}
                onPress={() => handleToggle(item)}
              >
                <Text style={styles.collectionName}>{item}</Text>
                <Text style={styles.actionText}>
                  {isBookmarked(post.id, item) ? 'Remove' : 'Add'}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.newCollectionRow}>
            <TextInput
              style={styles.input}
              placeholder="New collection name"
              value={newCollection}
              onChangeText={setNewCollection}
            />
            <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
              <Text style={styles.createBtnText}>Create</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  collectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  collectionName: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#2E45A3',
  },
  newCollectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  createBtn: {
    backgroundColor: '#2E45A3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 18,
    alignSelf: 'center',
  },
  closeBtnText: {
    color: '#888',
    fontSize: 16,
  },
}); 