import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function SettingsScreen() {
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [budget, setBudget] = useState('');
  const [likedFood, setLikedFood] = useState('');
  const [dislikedFood, setDislikedFood] = useState('');
  const [dontSuggest, setDontSuggest] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Important Restrictions</Text>
      <TextInput
        style={styles.input}
        placeholder="Allergies"
        placeholderTextColor="#999"
        value={allergies}
        onChangeText={setAllergies}
      />
      <TextInput
        style={styles.input}
        placeholder="Dietary Restrictions"
        placeholderTextColor="#999"
        value={dietaryRestrictions}
        onChangeText={setDietaryRestrictions}
      />
      <TextInput
        style={styles.input}
        placeholder="Budget ($)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />

      <Text style={styles.sectionHeader}>Preferences</Text>
      <TextInput
        style={styles.input}
        placeholder="Liked Food"
        placeholderTextColor="#999"
        value={likedFood}
        onChangeText={setLikedFood}
      />
      <TextInput
        style={styles.input}
        placeholder="Disliked Food"
        placeholderTextColor="#999"
        value={dislikedFood}
        onChangeText={setDislikedFood}
      />

      <Text style={styles.sectionHeader}>Suggestions Settings</Text>
      <TextInput
        style={styles.input}
        placeholder="Don't Suggest"
        placeholderTextColor="#999"
        value={dontSuggest}
        onChangeText={setDontSuggest}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 20,
  },
  sectionHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: 'white',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
