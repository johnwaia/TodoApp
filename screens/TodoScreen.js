// screens/TodoScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function TodoScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    loadTasks();
  }, [isFocused]);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) {
      const parsed = JSON.parse(data);
      setTasks(parsed.filter(task => task.status === 'ajouter'));
    }
  };

  const updateStatus = async (taskIndexInList, newStatus) => {
    const data = await AsyncStorage.getItem('tasks');
    if (!data) return;

    let allTasks = JSON.parse(data);

    // Trouve la vraie position dans la liste complète
    const originalIndex = allTasks.findIndex(
      task =>
        task.title === tasks[taskIndexInList].title &&
        task.status === 'ajouter'
    );

    if (originalIndex !== -1) {
      allTasks[originalIndex].status = newStatus;
      await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
      setTasks(allTasks.filter(task => task.status === 'ajouter'));
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.title}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: '#007bff' }]}
          onPress={() => updateStatus(index, 'en cours')}
        >
          <Text style={styles.buttonLabel}>En cours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: '#28a745' }]}
          onPress={() => updateStatus(index, 'terminer')}
        >
          <Text style={styles.buttonLabel}>Terminer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tâches à faire</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }} // <== ✅ ici l'espace sous la liste
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.buttonText}>+ Ajouter une tâche</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  taskItem: {
    padding: 15,
    backgroundColor: '#ffefc1',
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: { fontSize: 16 },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
