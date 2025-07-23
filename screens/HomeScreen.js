// screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des tâches</Text>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Todo')}
      >
        <Text style={styles.tabText}>📋 À faire</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('InProgress')}
      >
        <Text style={styles.tabText}>🕗 En cours</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Done')}
      >
        <Text style={styles.tabText}>✅ Terminées</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  tabButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
