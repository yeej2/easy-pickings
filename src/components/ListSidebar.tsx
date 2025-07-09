import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddPageIcon from '../assets/add-page-icon.svg';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; // or wherever your AuthContext is
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // ✅ this is correct
import { AuthStackParamList } from '../navigation/types'; // ✅ make sure path is correct
import SettingsModal from './SettingsModal'; // adjust path if needed

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Settings'>;


const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85;

type Props = {
  isOpen: boolean;
  toggleSidebar: (open: boolean) => void;
};

export default function ListSidebar({ isOpen, toggleSidebar }: Props) {
  // Inside your component
  const navigation = useNavigation<NavigationProp>();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const { logout } = useAuth();
  const [settingsVisible, setSettingsVisible] = useState(false);

  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  
  // Fetch name from Firestore
  useEffect(() => {
    const fetchName = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFullName(`${data.firstName} ${data.lastName}`);
        }
      }
    };
  
    fetchName();
  }, [user?.uid]);

  
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return isOpen && gestureState.dx < -10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(Math.max(gestureState.dx, -SIDEBAR_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          toggleSidebar(false);
        } else {
          toggleSidebar(true);
        }
      },
    })
  ).current;
  

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);


  return (
    <>
      {isOpen && (
        <Pressable
          style={styles.overlay}
          onPress={() => toggleSidebar(false)}
        />
      )}

        <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: 0 }] }]}
        >
        <View style={styles.searchRow}>
        <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#ccc" style={{ marginLeft: 8 }} />
            <TextInput
            placeholder="Search for Lists"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            />
        </View>
        <TouchableOpacity>
            <AddPageIcon
            width={26}
            height={26}
            style={{ marginLeft: 12 }}
            fill="white"
            />
        </TouchableOpacity>
        </View>


        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.sidebarItem}><Text style={styles.listText}>4th of July Shopping List</Text></TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.sidebarItem}><Text style={styles.listText}>Family List 🟣</Text></TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.sidebarItem}><Text style={styles.listText}>Friend’s Gathering 🟡</Text></TouchableOpacity>
          <View style={styles.divider} />
        </View>

{/* User Info + Popup Container */}
<View style={{ position: 'relative', marginBottom: 0 }}>
  <TouchableOpacity onPress={toggleMenu}>
    <View style={styles.userInfo}>
      <Ionicons name="person-circle" size={30} color="white" />
      <Text style={styles.userText}>{fullName ? fullName : user?.email || 'User Settings'}</Text>
    </View>
  </TouchableOpacity>

  {menuVisible && (
    <View style={styles.popupMenu}>
      <TouchableOpacity
        style={styles.popupItem}
        onPress={() => {
          setMenuVisible(false);
          setSettingsVisible(true); // open modal instead of navigating
        }}
      >
        <Ionicons name="settings-outline" size={20} color="white" />
        <Text style={styles.popupText}>Settings</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.popupItem}
        onPress={() => {
          setMenuVisible(false);
          logout(); // from useAuth
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.popupText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )}
</View>
      </Animated.View>
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </>
    
  );
  
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#1e1e1e',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 2,
    justifyContent: 'space-between',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    color: 'white',
  },
  
  listContainer: {
    flexGrow: 1,
  },
  sidebarItem: {
    paddingVertical: 12,
  },
  listText: {
    fontSize: 16,
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 70,
  },
  userText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  popupMenu: {
    position: 'absolute',
    bottom: 110, // relative to the userInfo view
    left: 0,
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    zIndex: 100,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: 250,
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
    
});
