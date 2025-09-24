import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ClientCaseForm } from '../components/ClientCaseForm';
import { useCases } from '../hooks/useCases';
import { CreateCaseData } from '../utils/validations';

export const CreateCaseScreen: React.FC = () => {
  const navigation = useNavigation();
  const { createCase } = useCases();

  const handleSubmit = async (data: CreateCaseData) => {
    try {
      await createCase(data);
      Alert.alert(
        'Éxito',
        'Caso creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      // El error ya se maneja en el componente
      throw error;
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ClientCaseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});