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

export default function InProgressScreen({ navigation }) {
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
      setTasks(parsed.filter(task => task.status === 'en cours'));
      setSelectedTasks([]); // reset selection
    }
  };

  const toggleSelectTask = (title) => {
    if (selectedTasks.includes(title)) {
      setSelectedTasks(selectedTasks.filter(t => t !== title));
    } else {
      setSelectedTasks([...selectedTasks, title]);
    }
  };

  const finishSelectedTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (!data) return;

    let allTasks = JSON.parse(data);

    allTasks = allTasks.map(task => {
      if (selectedTasks.includes(task.title) && task.status === 'en cours') {
        return { ...task, status: 'terminer' };
      }
      return task;
    });

    await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
    loadTasks();
  };

  const confirmFinish = () => {
    Alert.alert(
      'Terminer les tâches ?',
      'Voulez-vous marquer ces tâches comme terminées ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Terminer', onPress: finishSelectedTasks },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedTasks.includes(item.title);

    return (
      <TouchableOpacity
  style={[
    styles.taskItem,
    isSelected && styles.taskItemSelected,
  ]}
  onLongPress={() => toggleSelectTask(item.title)}
  onPress={() => selectedTasks.length > 0 && toggleSelectTask(item.title)}
>
  <Text style={[styles.taskText, isSelected && styles.taskTextSelected]}>
    {item.title}
  </Text>

  {selectedTasks.length === 0 && (
    <TouchableOpacity
      style={styles.finishButton}
      onPress={() => confirmFinish([item.title])}
    >
    </TouchableOpacity>
  )}
      </TouchableOpacity>

    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tâches en cours</Text>
      {tasks.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>
                      Aucune tâche en cours.
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
    style={[styles.actionButton, { backgroundColor: '#28a745' }]}
    onPress={confirmFinish}
  >
    <Text style={styles.buttonText}>Terminer</Text>
  </TouchableOpacity>
</View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: { fontSize: 16, flex: 1 },

  actionBar: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
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
  taskItemSelected: {
  backgroundColor: '#cd8a02',
  borderWidth: 2,
  borderColor: '#ab7304ff',
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},

taskTextSelected: {
  color: '#fff',
  fontWeight: 'bold',
},

});
