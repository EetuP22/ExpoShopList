import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StatusBar, StyleSheet } from 'react-native';

export default function App() {
  const [item, setItem] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  const addItem = () => {
    if (item.trim() !== '') {
      setShoppingList([...shoppingList, item]);
      setItem('');
    }
  };

  const clearList = () => {
    setShoppingList([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Add Item"
        value={item}
        onChangeText={setItem}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          width: '80%',
          marginBottom: 10,
          paddingLeft: 10,
          marginTop: 50,
        }}
      />
      <View style={styles.row}>
        <Button title="Add" onPress={addItem} />
        <Button title="Clear" onPress={clearList} />
      </View>
      <Text style={{ fontSize: 18, marginVertical: 20, color: 'blue' }}>Shopping List</Text>
      <FlatList
        data={shoppingList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={{ fontSize: 18 }}>{item}</Text>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    marginBottom: 10,
  },
});