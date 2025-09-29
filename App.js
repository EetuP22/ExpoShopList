import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StatusBar, StyleSheet, Pressable, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('shopping.db');
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS shopping (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item TEXT,
            amount TEXT
          )
        `);

        await loadItems(database);
      } catch (error) {
        console.error("Initialize DB error: ", error);
      }
    };

    initialize();
  }, []);

  const loadItems = async (database = db) => {
    if (!database) return;
    try {
      const rows = await database.getAllAsync('SELECT * FROM shopping;');
      setShoppingList(rows);
    } catch (error) {
      console.error("Load items error:", error);
    }
  };

  const addItem = async () => {
    if (!db) return;
    if (item.trim() === '' || amount.trim() === '') {
      Alert.alert("Input error", "Item and amount must not be empty");
      return;
    }
    try {
      await db.runAsync('INSERT INTO shopping (item, amount) VALUES (?, ?);', [item, amount]);
      setItem('');
      setAmount('');
      await loadItems();
    } catch (error) {
      console.error("Insert error:", error);
    }
  };

  const deleteItem = async (id) => {
    if (!db) return;
    try {
      await db.runAsync('DELETE FROM shopping WHERE id = ?;', [id]);
      await loadItems();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Item"
        value={item}
        onChangeText={setItem}
        style={styles.input}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <Button title="Save" onPress={addItem} />

      <Text style={styles.title}>Shopping List</Text>
      <FlatList
        data={shoppingList}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.item}, {item.amount}</Text>
            <Pressable onPress={() => deleteItem(item.id)}>
              <Text style={styles.link}>bought</Text>
            </Pressable>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    marginVertical: 20,
    color: 'blue',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 5,
  },
  link: {
    color: 'blue',
  },
});
