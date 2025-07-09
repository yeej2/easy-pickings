import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const drawerWidth = width * 0.85;

const categories = [
  { name: 'Browse All', image: require('../assets/categories/all.jpg') },
  { name: 'Weeknight', image: require('../assets/categories/weeknight.jpg') },
  { name: 'Chicken', image: require('../assets/categories/chicken.jpg') },
  { name: 'Vegetarian', image: require('../assets/categories/vegetarian.jpg') },
  { name: 'Side Dishes', image: require('../assets/categories/sides.jpg') },
  { name: 'Desserts', image: require('../assets/categories/desserts.jpg') },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  translateX: Animated.Value;
  toggleSidebar: (open: boolean) => void;

};

export default function ListMeals({ isOpen, onClose, onOpen, translateX }: Props) {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        !isOpen && gesture.moveX > width - 25 && gesture.dx < -10 ||
        isOpen && gesture.dx < -10,
      onPanResponderMove: (_, gesture) => {
        if (isOpen) {
            translateX.setValue(Math.max(-drawerWidth, gesture.dx));
          } else if (gesture.moveX > width - 25 && gesture.dx < 0) {
            translateX.setValue(Math.max(drawerWidth + gesture.dx, 0));
          }          
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -50) {
            onClose();
          } else {
            onOpen(); // snap open
          }
        },
    })
  ).current;

  return (
        <Animated.View
        style={[styles.drawer, { transform: [{ translateX }] }]}
        >
        <View style={styles.searchRow}>
        <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#ccc" style={{ marginLeft: 8 }} />
            <TextInput
            placeholder="Search Library"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            />
        </View>
        <TouchableOpacity>
            <Text style={styles.favorites}>♡ Favorites</Text>
        </TouchableOpacity>
        </View>




      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Custom Recipe</Text>
      </TouchableOpacity>

      <View style={styles.categoryGrid}>
        {categories.map((cat, idx) => (
          <TouchableOpacity key={idx} style={styles.categoryTile}>
            <Image source={cat.image} style={styles.categoryImage} />
            <View style={styles.overlay}>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
    drawer: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: drawerWidth,
        height,
        backgroundColor: '#1e1e1e',
        zIndex: 3,
        paddingTop: 60,
        paddingHorizontal: 16,
      },
     
      searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
      },
      searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2e2e2e',
        borderRadius: 20,
        paddingVertical: 6,
      },
      searchInput: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        color: '#fff',
      },
      
    favorites: {
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryTile: {
        width: '48%',
        marginBottom: 16,
        borderRadius: 10,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    categoryText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
