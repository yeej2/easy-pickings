import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View,TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import CollapsibleSection from './CollapsibleSection';

export default function PreferencesTab() {
  const { user } = useAuth();
  const [likedFood, setLikedFood] = useState('');
  const [dislikedFood, setDislikedFood] = useState('');
  const [eatMore, setEatMore] = useState<string[]>([]);
  const foodOptions = ['Protein', 'Carbs', 'Fiber', 'Fruit', 'Vegetables', 'Whole grains'];


      
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikedFood(data.likedFood || '');
        setDislikedFood(data.dislikedFood || '');
        setEatMore(data.eatMore || []);  // ✅ Add this line to load from Firestore
      }
    };
    fetchData();
  }, [user]);
  

  const saveToFirebase = async () => {
    if (!user) return;
    await setDoc(
      doc(db, 'users', user.uid),
      {
        likedFood,
        dislikedFood,
      },
      { merge: true }
    );
  };

    // Load preferences from Firestore
    const fetchPreferences = async () => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid, 'settings', 'preferences');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.eatMore) setEatMore(data.eatMore);
        }
      };
    // Save preferences to Firestore
    const savePreferences = async (newSelection: string[]) => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid, 'settings', 'preferences');
        await setDoc(docRef, { eatMore: newSelection }, { merge: true });
      };

  const toggleFood = (item: string) => {
    const updated = eatMore.includes(item)
      ? eatMore.filter((i) => i !== item)
      : [...eatMore, item];
    setEatMore(updated);
    savePreferences(updated);
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return (
    <View style={styles.container}>
      <CollapsibleSection title="Liked Food">
        <TextInput
          style={styles.input}
          placeholder="List foods you like..."
          placeholderTextColor="#888"
          value={likedFood}
          onChangeText={setLikedFood}
          onBlur={saveToFirebase}
          multiline
        />
      </CollapsibleSection>

      <CollapsibleSection title="Disliked Food">
        <TextInput
          style={styles.input}
          placeholder="List foods you dislike..."
          placeholderTextColor="#888"
          value={dislikedFood}
          onChangeText={setDislikedFood}
          onBlur={saveToFirebase}
          multiline
        />
      </CollapsibleSection>
      
      {/* Would Like to Eat More */}
      <CollapsibleSection title="Would Like to Eat More">
  <View style={styles.buttonGrid}>
    {['Protein', 'Carbs', 'Fiber', 'Fruit', 'Vegetables', 'Whole grains'].map((item) => (
      <TouchableOpacity
        key={item}
        style={[
          styles.preferenceButton,
          eatMore.includes(item) && styles.preferenceButtonSelected,
        ]}
        onPress={async () => {
          const newList = eatMore.includes(item)
            ? eatMore.filter((i) => i !== item)
            : [...eatMore, item];

          setEatMore(newList);

          // Write to Firestore
          if (user) {
            try {
              const userDocRef = doc(db, 'users', user.uid);
              await updateDoc(userDocRef, {
                eatMore: newList,
              });
            } catch (error) {
              console.error('Failed to update eatMore in Firestore:', error);
            }
          }
        }}
      >
        <Text
          style={[
            styles.preferenceButtonText,
            eatMore.includes(item) && styles.preferenceButtonTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</CollapsibleSection>

    </View>
    
  );
}

const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
  input: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 14,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  
  preferenceButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#333',
  },
  
  preferenceButtonSelected: {
    backgroundColor: '#111',
  },
  
  preferenceButtonText: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  
  preferenceButtonTextSelected: {
    color: 'white',
  },
  container: {
    paddingHorizontal: 12,
    marginTop: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  selectedOption: {
    backgroundColor: '#4caf50',
  },
  optionText: {
    color: 'white',
    fontSize: 14,
  },
  
});
