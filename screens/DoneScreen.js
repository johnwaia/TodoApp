import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DoneScreen() {
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
      setTasks(parsed.filter(task => task.status === 'terminer'));
      setSelectedTasks([]); // reset selection
    }
  };

  const handleLongPress = (task) => {
    if (selectedTasks.includes(task.title)) {
      setSelectedTasks(selectedTasks.filter(title => title !== task.title));
    } else {
      setSelectedTasks([...selectedTasks, task.title]);
    }
  };

  const undoSelectedTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (!data) return;

    let allTasks = JSON.parse(data);

    allTasks = allTasks.map(task => {
      if (selectedTasks.includes(task.title) && task.status === 'terminer') {
        return { ...task, status: 'en cours' };
      }
      return task;
    });

    await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
    loadTasks();
  };

  const deleteSelectedTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (!data) return;

    let allTasks = JSON.parse(data);

    allTasks = allTasks.filter(
      task => !selectedTasks.includes(task.title)
    );

    await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
    loadTasks();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Supprimer les tâches ?',
      'Voulez-vous vraiment supprimer définitivement ces tâches ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: deleteSelectedTasks, style: 'destructive' },
      ]
    );
  };

  const confirmUndo = () => {
    Alert.alert(
      'Remettre en cours ?',
      'Voulez-vous remettre ces tâches en cours ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: undoSelectedTasks },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedTasks.includes(item.title);
    return (
      <TouchableOpacity
        style={[styles.taskItem, styles.taskDone, isSelected && styles.taskItemSelected]}
        onLongPress={() => handleLongPress(item)}
      >
        <Text style={styles.taskText}>{item.title}</Text>

  
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tâches terminées</Text>
      {tasks.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>
          Aucune tâche terminée.
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
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
            onPress={confirmUndo}
          >
            <Icon name="undo" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            onPress={confirmDelete}
          >
            <Icon name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  taskItem: {
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskItemSelected: {
    backgroundColor: '#c4f0cf',
    borderWidth: 2,
    borderColor: '#28a745',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    color: '#155724',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  deleteButton: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  undoButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  actionBar: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
