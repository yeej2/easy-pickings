import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    PanResponder,
    ScrollView,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListSidebar from '../components/ListSidebar';
import ListMeals from '../components/ListMeals';


const { width, height } = Dimensions.get('window');
const drawerWidth = width * 0.85;

const meals = [
  { id: '1', name: 'Vegetable Stir Fry', servings: 4, color: '#85C1E9' },
  { id: '2', name: 'PB&J', servings: 4, color: '#BB8FCE' },
  { id: '3', name: 'Creamy Garlic Chicken', servings: 4, color: '#F5B7B1' },
];

export default function HomeScreen() {
  const [leftOpen, setLeftOpen] = useState(false);
  const leftAnim = useRef(new Animated.Value(-width * 0.85)).current;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMealsOpen, setIsMealsOpen] = useState(false);
  const mealsTranslateX = useRef(new Animated.Value(width)).current;
  const [shoppingList, setShoppingList] = useState([
    { id: '1', name: 'Bell Peppers', quantity: 3, checked: false },
    { id: '2', name: 'Grape Jelly', quantity: 1, checked: true },
  ]);
  
  const [suggestions, setSuggestions] = useState([
    { id: 's1', name: 'Carrots', quantity: 4 },
    { id: 's2', name: 'Bread', quantity: '1 loaf' },
  ]);

  const [newItemText, setNewItemText] = useState('');

  const addShoppingItem = () => {
    if (newItemText.trim()) {
      setShoppingList(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: newItemText.trim(),
          quantity: 1,
          checked: false,
        }
      ]);
      setNewItemText('');
    }
  };
  
  
  
  const moveToShoppingList = (item: { id: string; name: string; quantity: string | number }) => {
    setSuggestions(prev => prev.filter(s => s.id !== item.id));
    setShoppingList(prev => [
      ...prev,
      {
        ...item,
        quantity: Number(item.quantity),
        checked: false
      }
    ]);
  };
  

  
  
  const toggleItemChecked = (id: string) => {
    setShoppingList((prev) =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
    const onMealsOpen = () => {
    Animated.timing(mealsTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    }).start();
    setIsMealsOpen(true);
    };

    const onMealsClose = () => {
        Animated.timing(mealsTranslateX, {
          toValue: drawerWidth,  // instead of `width`
          duration: 300,
          useNativeDriver: true,
        }).start(() => setIsMealsOpen(false));
      };

  const toggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
  };
  
  const toggleMealsSidebar = (open: boolean) => {
    setIsMealsOpen(open);
  };
  
  const toggleLeft = (open: boolean) => {
    Animated.timing(leftAnim, {
      toValue: open ? 0 : -width * 0.85,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setLeftOpen(open);
  };

//   const toggleRight = (open: boolean) => {
//     Animated.timing(rightAnim, {
//       toValue: open ? width - width * 0.85 : width,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//     setRightOpen(open);
//   };

    const panResponder = useRef(
        PanResponder.create({
        onMoveShouldSetPanResponder: (_, { dx, dy, moveX }) => {
            const horizontal = Math.abs(dx) > Math.abs(dy);
            return horizontal && (moveX < 25 || moveX > width - 25 || leftOpen || isMealsOpen);
        },
        onPanResponderMove: (_, { dx, moveX }) => {
            if (leftOpen) {
            leftAnim.setValue(Math.max(dx, -drawerWidth));
            } else if (isMealsOpen) {
            mealsTranslateX.setValue(Math.min(dx, drawerWidth));
            } else if (moveX < 25 && dx > 0) {
            leftAnim.setValue(Math.min(-drawerWidth + dx, 0));
            } else if (moveX > width - 25 && dx < 0) {
            mealsTranslateX.setValue(Math.max(drawerWidth + dx, 0));
            }
        },
        onPanResponderRelease: (_, { dx, moveX }) => {
            if (leftOpen && dx < -50) toggleLeft(false);
            else if (!leftOpen && moveX < 25 && dx > 50) toggleLeft(true);
            else if (isMealsOpen && dx > 50) onMealsClose();
            else if (!isMealsOpen && moveX > width - 25 && dx < -50) onMealsOpen();
            else {
            toggleLeft(leftOpen);
            if (isMealsOpen) onMealsOpen();
            else onMealsClose();
            }
        },
        })
    ).current;
  

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
        {(leftOpen || isMealsOpen) && (
        <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => {
            if (leftOpen) toggleLeft(false);
            if (isMealsOpen) onMealsClose();
            }}
        />
        )}


      {/* Side Panels */}
      <Animated.View style={[styles.leftDrawer, { transform: [{ translateX: leftAnim }] }]}>
        <ListSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </Animated.View>

      <Animated.View style={[styles.rightDrawer, { transform: [{ translateX: mealsTranslateX }] }]}>
        <ListMeals
            isOpen={isMealsOpen}
            toggleSidebar={toggleMealsSidebar}
            onOpen={onMealsOpen}
            onClose={onMealsClose}
            translateX={mealsTranslateX}
        />
        </Animated.View>


      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => toggleLeft(true)} style={styles.iconButton}>
          <Ionicons name="menu" size={26} color="white" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.iconRow}>
            <Ionicons name="share-outline" size={22} color="white" />
            <Text style={styles.iconText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconRow, { marginLeft: 16 }]}
            onPress={() => onMealsOpen()}
          >
            <Ionicons name="add" size={22} color="white" />
            <Text style={styles.iconText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Meal Name</Text>
        <Text style={styles.tableHeaderText}>Servings</Text>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.mealRow, { backgroundColor: '#1f1f1f' }]}>
            <View style={[styles.mealButton, { backgroundColor: item.color }]}>
              <Ionicons name="document-text-outline" size={16} color="black" />
              <Text style={styles.mealText}>{item.name}</Text>
            </View>
            <View style={styles.servingsBox}>
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text style={styles.servings}>{item.servings}</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />

    <View style={styles.bottomSection}>
    <View style={styles.column}>
    <Text style={styles.columnHeader}>Shopping List</Text>
    <ScrollView style={styles.listScroll}>
  {/* Replace static list items with this: */}
  {shoppingList.map((item) => (
    <View key={item.id} style={styles.listItem}>
      <TouchableOpacity onPress={() => toggleItemChecked(item.id)}>
        <Ionicons
          name={item.checked ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color="white"
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.itemText,
          item.checked && { textDecorationLine: 'line-through', color: 'gray' },
        ]}
      >
        {item.name} ({item.quantity})
      </Text>
      <TouchableOpacity>
        <Ionicons name="trash-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  ))}
  <View style={styles.addItemRow}>
  <TextInput
    style={styles.input}
    placeholder="Add new item..."
    placeholderTextColor="#aaa"
    value={newItemText}
    onChangeText={setNewItemText}
    onSubmitEditing={addShoppingItem}
    returnKeyType="done"
  />
  <TouchableOpacity onPress={addShoppingItem}>
    <Ionicons name="add-circle-outline" size={24} color="white" />
  </TouchableOpacity>
</View>

</ScrollView>

  </View>

  <View style={styles.verticalDivider} />

  <View style={styles.column}>
    <View style={styles.suggestionHeader}>
      <Text style={styles.columnHeader}>Suggestions</Text>
      <Ionicons name="settings-outline" size={20} color="white" />
    </View>
    <ScrollView style={styles.listScroll}>
        {suggestions.map((item) => (
        <View key={item.id} style={styles.listItem}>
        <TouchableOpacity onPress={() => moveToShoppingList(item)}>
            <Ionicons name="arrow-back-outline" size={20} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.itemText}>
            {item.name} ({item.quantity})
        </Text>
        <TouchableOpacity>
            <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
        </View>
    ))}
    </ScrollView>
  </View>
</View>


    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  overlay: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  leftDrawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.85,
    backgroundColor: '#1e1e1e',
    zIndex: 20,
  },
  rightDrawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width * 0.85,
    backgroundColor: '#1e1e1e',
    zIndex: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    padding: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  mealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  mealText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  servingsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servings: {
    fontSize: 16,
    color: 'white',
  },

  bottomSection: {
    marginTop: 30, // smaller than before
    flexDirection: 'row',
    height: '45%', // Adjust based on your design
    borderTopColor: '#FFFFFF',
    borderTopWidth: 1,
  },
  
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  
  verticalDivider: {
    width: 1,
    backgroundColor: '#aaa',
    marginVertical: 10,
  },
  
  columnHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  listScroll: {
    flex: 1,
  },
  
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    gap: 10,
  },
  
  itemText: {
    color: 'white',
    flex: 1,
    fontSize: 15,
  },
    
  input: {
    flex: 1,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    marginRight: 10,
    paddingVertical: 4,
  },
  
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  }
  
});
