import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import CollapsibleSection from './CollapsibleSection';

export default function RestrictionsTab() {
  const { user } = useAuth();
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetType, setBudgetType] = useState<'Month' | 'Week' | 'Trip' | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

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
        setBudgetType(data.budgetType || 'Month');
      }
      setDataLoaded(true); // ✅ mark as loaded AFTER values are set
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
        budgetType,
      },
      { merge: true }
    );
  };
  

  useEffect(() => {
    if (!dataLoaded) return; // ✅ wait until Firestore has populated the state
  
    const saveBudget = async () => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        budget,
        budgetType,
      });
    };
    saveBudget();
  }, [budget, budgetType, dataLoaded]); // ✅ include dataLoaded as dependency
  
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

      <CollapsibleSection title="Budget">
        {budgetType && (
          <View style={styles.toggleRow}>
            {['Month', 'Week', 'Trip'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.toggleButton,
                  budgetType === type && styles.toggleButtonSelected,
                ]}
                onPress={() => setBudgetType(type as 'Month' | 'Week' | 'Trip')}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    budgetType === type && styles.toggleButtonTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter budget amount"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#444',
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonSelected: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#ccc',

  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleButtonTextSelected: {
    color: '#fff',
  },
  
});
