import React, { useRef, useState } from 'react';
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
import ManualRecipeModal from './ManualRecipeModal'; // adjust path as needed
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth'; // or use from your AuthContext
import { useAuth } from '../context/AuthContext';


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

export async function saveManualRecipe(user: User, recipe: {
  name: string;
  ingredients: string;
  instructions: string;
  notes: string;
}) {
  try {
    const recipesRef = collection(db, 'users', user.uid, 'customRecipes');
    await addDoc(recipesRef, {
      ...recipe,
      createdAt: new Date(),
    });
    console.log('Recipe saved!');
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
}

export default function ListMeals({ isOpen, onClose, onOpen, translateX }: Props) {
  const [manualRecipeVisible, setManualRecipeVisible] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualIngredients, setManualIngredients] = useState('');
  const [manualInstructions, setManualInstructions] = useState('');
  const [manualNotes, setManualNotes] = useState('');

  const [showRecipeOptions, setShowRecipeOptions] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const [recipeNotes, setRecipeNotes] = useState('');
  const { user } = useAuth(); // at top of your component

  const handleSaveManualRecipe = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'customRecipes'), {
        name: manualName,
        ingredients: manualIngredients,
        instructions: manualInstructions,
        notes: manualNotes,
        createdAt: new Date(),
      });

      // Clear form after saving
      setManualName('');
      setManualIngredients('');
      setManualInstructions('');
      setManualNotes('');
      setManualRecipeVisible(false);
    } catch (error) {
      console.error('Error saving manual recipe:', error);
    }
  };

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
            <Text style={styles.favorites}>♡ Recipes</Text>
        </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setShowRecipeOptions(!showRecipeOptions)} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Custom Recipe</Text>
        </TouchableOpacity>

        {showRecipeOptions && (
          <View style={styles.recipePopup}>
            <TouchableOpacity style={styles.popupItem} onPress={() => {
              setShowRecipeOptions(false);
              // handle with picture
            }}>
              <Ionicons name="camera-outline" size={20} color="white" />
              <Text style={styles.popupText}>With a Picture</Text>
            </TouchableOpacity>
          <View style={styles.divider} />

            <TouchableOpacity style={styles.popupItem} onPress={() => {
              setShowRecipeOptions(false);
              // handle with link
            }}>
              <Ionicons name="link-outline" size={20} color="white" />
              <Text style={styles.popupText}>With a Link</Text>
            </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.popupItem} onPress={() => {
            setShowRecipeOptions(false);
            setManualRecipeVisible(true);
          }} >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text style={styles.popupText}>Manually</Text>
          </TouchableOpacity>


          </View>
        )}


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

      <ManualRecipeModal
  visible={manualRecipeVisible}
  onClose={() => setManualRecipeVisible(false)}
  onSave={handleSaveManualRecipe}
  name={manualName}
  ingredients={manualIngredients}
  instructions={manualInstructions}
  notes={manualNotes}
  setName={setManualName}
  setIngredients={setManualIngredients}
  setInstructions={setManualInstructions}
  setNotes={setManualNotes}
/>

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
        fontWeight: '600',
        fontSize: 16,
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
    recipePopup: {
      position: 'absolute',
      bottom: 414, // relative to the userInfo view
      left: 0,
      backgroundColor: '#2e2e2e',
      borderRadius: 10,
      zIndex: 100,
      paddingVertical: 8,
      paddingHorizontal: 20,
      width: 290,
      elevation: 10,
      borderColor: '#444'
    },
    popupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    popupText: {
      marginLeft: 10,
      fontSize: 16,
      color: '#FFF',
    },
    divider: {
      height: 1,
      backgroundColor: '#444',
      marginVertical: 4,
    },
  
});
