import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ClientCasesList } from '../components/ClientCasesList';
import { useCases } from '../hooks/useCases';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { cases, isLoading, error, fetchCases } = useCases();

  const handleCasePress = (caseId: string) => {
    navigation.navigate('CaseDetails', { caseId });
  };

  const handleCreateCase = () => {
    navigation.navigate('CreateCase');
  };

  return (
    <View style={styles.container}>
      <ClientCasesList
        cases={cases}
        isLoading={isLoading}
        error={error}
        onRefresh={fetchCases}
        onCasePress={handleCasePress}
        onCreateCase={handleCreateCase}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});