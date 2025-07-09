import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import CollapsibleSection from './CollapsibleSection';

export default function SuggestionsTab() {
  const { user } = useAuth();
  const [dontSuggest, setDontSuggest] = useState('');
  const [trackHabits, setTrackHabits] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDontSuggest(data.dontSuggest || '');
      }
    };
    fetchData();
  }, [user]);

  const saveToFirebase = async () => {
    if (!user) return;
    await setDoc(
      doc(db, 'users', user.uid),
      {
        dontSuggest,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDontSuggest(data.dontSuggest || '');
        setTrackHabits(data.trackHabits ?? null); // ✅ Load it
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (trackHabits === null || !user) return;
    const saveTrackHabits = async () => {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { trackHabits }, { merge: true }); // 🔥 Merge!
    };
    saveTrackHabits();
  }, [trackHabits, user]);
  
  
  return (
    <View style={styles.container}>
      <CollapsibleSection title="Don't Suggest">
        <TextInput
          style={styles.input}
          placeholder="Enter items you don't want suggested..."
          placeholderTextColor="#888"
          value={dontSuggest}
          onChangeText={setDontSuggest}
          onBlur={saveToFirebase}
          multiline
        />
      </CollapsibleSection>
      
      <CollapsibleSection title="Track Habits & Preferences?">
  <View style={styles.toggleRow}>
    <TouchableOpacity
      style={[
        styles.toggleButton,
        trackHabits === true && styles.toggleButtonSelected,
      ]}
      onPress={() => setTrackHabits(true)}
    >
      <Text
        style={[
          styles.toggleButtonText,
          trackHabits === true && styles.toggleButtonTextSelected,
        ]}
      >
        Yes
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.toggleButton,
        trackHabits === false && styles.toggleButtonSelected,
      ]}
      onPress={() => setTrackHabits(false)}
    >
      <Text
        style={[
          styles.toggleButtonText,
          trackHabits === false && styles.toggleButtonTextSelected,
        ]}
      >
        No
      </Text>
    </TouchableOpacity>
  </View>
</CollapsibleSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#555',
    marginHorizontal: 5,
  },
  
  toggleButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  
  toggleButtonText: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  
  toggleButtonTextSelected: {
    color: 'white',
  },
  
});
