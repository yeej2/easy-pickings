import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import CollapsibleSection from './CollapsibleSection';

export default function ConsiderationsTab() {
  const { user } = useAuth();
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAllergies(data.allergies || '');
        setDietaryRestrictions(data.dietaryRestrictions || '');
        setBudget(data.budget || '');
      }
    };
    fetchData();
  }, [user]);

  const saveToFirebase = async () => {
    if (!user) return;
    await setDoc(
      doc(db, 'users', user.uid),
      {
        allergies,
        dietaryRestrictions,
        budget,
      },
      { merge: true }
    );
  };

  return (
    <View style={styles.container}>
      <CollapsibleSection title="Allergies">
        <TextInput
          style={styles.input}
          placeholder="List any allergies..."
          placeholderTextColor="#888"
          value={allergies}
          onChangeText={setAllergies}
          onBlur={saveToFirebase}
          multiline
        />
      </CollapsibleSection>

      <CollapsibleSection title="Dietary Restrictions">
        <TextInput
          style={styles.input}
          placeholder="List any restrictions..."
          placeholderTextColor="#888"
          value={dietaryRestrictions}
          onChangeText={setDietaryRestrictions}
          onBlur={saveToFirebase}
          multiline
        />
      </CollapsibleSection>

      <CollapsibleSection title="Budget ($)">
        <TextInput
          style={styles.input}
          placeholder="Enter a budget amount"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
          onBlur={saveToFirebase}
        />
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
});
