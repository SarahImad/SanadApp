import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';

export default function FinalPage() {
  const params = useLocalSearchParams();
  const initialScore = {
    correct: Number(params.correct) || 0,
    total: Number(params.total) || 0,
    percentage: Number(params.percentage) || 0,
  };
  const [serverScore, setServerScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalScore = async () => {
      try {
        const response = await fetch('http://192.168.0.171:4000/api/total-results');
        const data = await response.json();
        setServerScore(data.score);
      } catch (error) {
        console.error('Error fetching total score:', error);
        setServerScore(initialScore); // Fallback to passed score
      } finally {
        setLoading(false);
      }
    };
    fetchTotalScore();
  }, []);

  const displayScore = serverScore || initialScore;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Test Complete!</Text>
        <Text style={styles.scoreText}>
          Total Score: {displayScore.correct} / {displayScore.total}
        </Text>
        <Text style={styles.percentageText}>
          Overall Percentage: {displayScore.percentage}%
        </Text>
        <Link href="/v1/set1" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Back to Start</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'rgb(225, 233, 226)',
    padding: 15,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'rgb(132, 154, 139)',
    fontSize: 18,
    fontWeight: 'bold',
  },
});