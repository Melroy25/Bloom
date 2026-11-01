import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect back to assignments
    const timer = setTimeout(() => {
      router.replace('/(tabs)/tasks/assignments');
    }, 300);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redirecting to Bloom...</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)/tasks/assignments')}
      >
        <Text style={styles.buttonText}>Go to Assignments</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F2',
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#29332E',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#365B45',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
