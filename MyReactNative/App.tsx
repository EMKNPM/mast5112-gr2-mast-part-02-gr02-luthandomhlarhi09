import React, { useState } from 'react';
import { Alert, FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Colour palette - works like the :root variables in style.css
const colours = {
  purple: '#8e5eb8',      // main brand colour
  purpleLight: '#d9c7ee', // light purple used for thin borders
  brown: '#7b4225',       // headings, labels and input borders
  red: '#d0342c',         // prices and error messages
  cream: '#fbf7f2',       // page background
  white: '#ffffff',       // header, cards and form
  lavender: '#f1eaf9',    // course badges and soft backgrounds
  grey: '#555555',        // body text
};

export default function App() {

  const [screen, setScreen] = useState('home');

  // The menu items, starting with two example dishes
  const [menuItems, setMenuItems] = useState([
    {
      id: '1',
      name: 'Garlic Butter Prawns',
      description: 'Fresh prawns fried in garlic & herbs with white wine sauce.',
      course: 'Starter',
      price: '120.00',
    },
    {
      id: '2',
      name: 'Rib Steak & Chips',
      description: 'grilled ribs marinated for two days, served with hand-cut chips and mushroom sauce.',
      course: 'Main Course',
      price: '240.00',
    },
  ]);

  // The four fields on the form
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');

  // Error message that shows above the form
  const [error, setError] = useState('');

  // Check the fields, then add the dish to the top of the list
  const handleAddDish = () => {

    if (dishName.trim() === '') {
      setError('Please enter a dish name.');
      return;
    }

    if (description.trim() === '') {
      setError('Please enter a dish description.');
      return;
    }

    if (price.trim() === '' || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Please enter a valid price (numbers only).');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: course,
      price: parseFloat(price).toFixed(2),
    };

    // add the new dish, clear the form and go back to the list
    setMenuItems([newItem, ...menuItems]);
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
    setError('');
    setScreen('home');

    Alert.alert('Dish added', newItem.name + ' has been added to the menu.');
  };

  // Screen 1 - the menu list
  const homeScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chef's Menu Manager</Text>
        <Text style={styles.subtitle}>Total Menu Items: {menuItems.length}</Text>
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No dishes on the menu yet.</Text>
            <Text style={styles.emptySubText}>
              Tap "+ Add New Dish" below to add your first dish.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishPrice}>R{item.price}</Text>
            </View>
            <Text style={styles.badge}>{item.course}</Text>
            <Text style={styles.dishDescription}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setError('');
            setScreen('add');
          }}
        >
          <Text style={styles.buttonText}>+ Add New Dish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Screen 2 - the add dish form
  const addScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollArea}>
      <View style={styles.formCard}>
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => {
              setError('');
              setScreen('home');
            }}
          >
            <Text style={styles.backLink}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.formTitle}>Add New Dish</Text>
        </View>

        {/* shows the validation message if a field is wrong */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Dish Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Garlic Butter Prawns"
          placeholderTextColor="#999"
          value={dishName}
          onChangeText={setDishName}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. Fresh prawns fried in garlic & herbs..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Course Category *</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={course}
            onValueChange={(itemValue) => setCourse(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        <Text style={styles.label}>Price (R) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 120.00"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.button} onPress={handleAddDish}>
            <Text style={styles.buttonText}>Save Dish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setError('');
              setScreen('home');
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colours.cream} />
      {screen === 'home' ? homeScreen() : addScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.cream,
  },
  container: {
    flex: 1,
    backgroundColor: colours.cream,
  },
  scrollArea: {
    flexGrow: 1,
    backgroundColor: colours.cream,
    padding: 16,
  },

  // header bar with the app name (like the site header)
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colours.white,
    borderBottomWidth: 4,
    borderBottomColor: colours.purple,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colours.purple,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colours.grey,
    marginTop: 4,
  },

  // menu list and cards
  list: {
    padding: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colours.grey,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 13,
    color: '#8a8a8a',
    textAlign: 'center',
    marginTop: 6,
  },
  card: {
    backgroundColor: colours.white,
    borderWidth: 1,
    borderColor: colours.purple,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colours.purple,
    marginRight: 10,
  },
  dishPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colours.red,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colours.lavender,
    color: colours.purple,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  dishDescription: {
    fontSize: 14,
    color: colours.grey,
    lineHeight: 20,
  },

  // footer with the add button
  footer: {
    padding: 16,
    backgroundColor: colours.white,
    borderTopWidth: 1,
    borderTopColor: colours.purpleLight,
  },

  formCard: {
    backgroundColor: colours.white,
    borderWidth: 1,
    borderColor: colours.purple,
    borderRadius: 12,
    padding: 16,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colours.purple,
    marginRight: 15,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colours.brown,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colours.brown,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colours.cream,
    borderWidth: 1,
    borderColor: colours.brown,
    borderRadius: 6,
    padding: 10,
    fontSize: 15,
    color: colours.grey,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerWrap: {
    backgroundColor: colours.cream,
    borderWidth: 1,
    borderColor: colours.brown,
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },

  // buttons - purple to match .btn in style.css
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: colours.purple,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colours.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colours.white,
    borderWidth: 1,
    borderColor: colours.brown,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colours.brown,
    fontSize: 16,
    fontWeight: '700',
  },


  errorBox: {
    backgroundColor: '#fbecec',   // very soft red (same as .btn-light hover)
    borderWidth: 1,
    borderColor: colours.red,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  errorText: {
    color: colours.red,
    fontSize: 13,
    fontWeight: '500',
  },
});
