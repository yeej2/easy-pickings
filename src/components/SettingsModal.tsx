import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConsiderationsTab from '../screens/settings/ConsiderationsTab';
import PreferencesTab from '../screens/settings/PreferencesTab';
import SuggestionsTab from '../screens/settings/SuggestionsTab';

const { width, height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
};

const tabs = ['Considerations', 'Preferences', 'Suggestions'];

export default function SettingsModal({ visible, onClose }: Props) {
  const [selectedTab, setSelectedTab] = useState('Considerations');

  const renderTab = () => {
    switch (selectedTab) {
      case 'Considerations':
        return <ConsiderationsTab />;
      case 'Preferences':
        return <PreferencesTab />;
      case 'Suggestions':
        return <SuggestionsTab />;
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
              >
                <Text style={styles.tabText}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={styles.tabContent}>
            {renderTab()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 15,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    height: height * 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    color: 'white',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  tabButton: {
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    color: 'white',
    fontSize: 14,
  },
  tabContent: {
    paddingVertical: 8,
  },
});
