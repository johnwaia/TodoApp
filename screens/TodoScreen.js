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
  const [selectedTasks, setSelectedTasks] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    loadTasks();
  }, [isFocused]);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) {
      const parsed = JSON.parse(data);
      setTasks(parsed.filter(task => task.status === 'ajouter'));
      setSelectedTasks([]);
    }
  };

  const toggleSelectTask = (title) => {
    setSelectedTasks(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const updateSelectedTasksStatus = async (newStatus) => {
    const data = await AsyncStorage.getItem('tasks');
    if (!data) return;

    let allTasks = JSON.parse(data);
    allTasks = allTasks.map(task =>
      selectedTasks.includes(task.title) && task.status === 'ajouter'
        ? { ...task, status: newStatus }
        : task
    );

    await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
    loadTasks(); 
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedTasks.includes(item.title);
    return (
      <TouchableOpacity
        style={[
          styles.taskItem,
          isSelected && { backgroundColor: '#cdeffd' },
        ]}
        onLongPress={() => toggleSelectTask(item.title)}
        onPress={() => selectedTasks.length > 0 && toggleSelectTask(item.title)}
      >
        <Text style={styles.taskText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tâches à faire</Text>
       {tasks.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>
                Aucune tâche à faire.
              </Text>
            ) : (
              <FlatList
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            )}

      {selectedTasks.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#007bff' }]}
            onPress={() => updateSelectedTasksStatus('en cours')}
          >
            <Text style={styles.buttonText}>En cours</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            onPress={() => updateSelectedTasksStatus('terminer')}
          >
            <Text style={styles.buttonText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedTasks.length === 0 && (
        <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTask')}
        >
            <Text style={styles.buttonText}>+ Ajouter une tâche</Text>
        </TouchableOpacity>
      )}

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

  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
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
  bottomBar: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',

  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
