import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: () => Promise<void>; // ✅ this must be here
    name: string;
    ingredients: string;
    instructions: string;
    notes: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setIngredients: React.Dispatch<React.SetStateAction<string>>;
    setInstructions: React.Dispatch<React.SetStateAction<string>>;
    setNotes: React.Dispatch<React.SetStateAction<string>>;
  };
  
  export default function ManualRecipeModal({
    visible,
    onClose,
    onSave,
    name,
    ingredients,
    instructions,
    notes,
    setName,
    setIngredients,
    setInstructions,
    setNotes,
  }: Props) {
  
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Custom Recipe</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter recipe name"
                placeholderTextColor="#aaa"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ingredients:</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={ingredients}
                onChangeText={setIngredients}
                placeholder="List ingredients"
                placeholderTextColor="#aaa"
                multiline
                scrollEnabled
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Instructions:</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Add step-by-step instructions"
                placeholderTextColor="#aaa"
                multiline
                scrollEnabled
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes:</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional notes"
                placeholderTextColor="#aaa"
                multiline
                scrollEnabled
                textAlignVertical="top"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#444',
      borderRadius: 20,
      width: '90%',
      height: '90%',
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    headerText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 6,
    },
    input: {
      backgroundColor: '#2e2e2e',
      color: 'white',
      borderRadius: 10,
      padding: 10,
      minHeight: 40,
    },
    multiline: {
      minHeight: 80,
      maxHeight: 200,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
      },
      saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
      },
      cancelButton: {
        backgroundColor: '#777',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    
  });
  