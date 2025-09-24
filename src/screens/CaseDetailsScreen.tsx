import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CaseNotes } from '../components/CaseNotes';
import { useCases, useCaseNotes } from '../hooks/useCases';
import { ClientCase } from '../types';
import { colors, formatters } from '../utils';

export const CaseDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { caseId } = route.params as { caseId: string };
  
  const [caseDetails, setCaseDetails] = useState<ClientCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getCaseById, deleteCase } = useCases();
  const {
    notes,
    isLoading: notesLoading,
    error: notesError,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useCaseNotes(caseId);

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  const loadCaseDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const details = await getCaseById(caseId);
      setCaseDetails(details);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar el caso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCase = () => {
    if (caseDetails) {
      navigation.navigate('EditCase', { caseId: caseDetails.id });
    }
  };

  const handleDeleteCase = () => {
    Alert.alert(
      'Eliminar Caso',
      '¿Estás seguro de que deseas eliminar este caso? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCase(caseId);
              Alert.alert(
                'Éxito',
                'Caso eliminado correctamente',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Error al eliminar el caso'
              );
            }
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return colors.info;
      case 'MEDIUM': return colors.warning;
      case 'HIGH': return colors.danger;
      case 'URGENT': return colors.danger;
      default: return colors.gray[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return colors.warning;
      case 'IN_PROGRESS': return colors.info;
      case 'COMPLETED': return colors.success;
      case 'CANCELLED': return colors.gray[500];
      default: return colors.gray[500];
    }
  };

  const renderCaseHeader = () => {
    if (!caseDetails) return null;

    return (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.clientName}>{caseDetails.clientName}</Text>
            <Text style={styles.caseType}>{caseDetails.caseType}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditCase}>
              <Text style={styles.editButtonText}>✏️ Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCase}>
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.badges}>
          <View
            style={[
              styles.badge,
              { backgroundColor: getPriorityColor(caseDetails.priority) + '20' },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getPriorityColor(caseDetails.priority) },
              ]}
            >
              {formatters.priority(caseDetails.priority)}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: getStatusColor(caseDetails.status) + '20' },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getStatusColor(caseDetails.status) },
              ]}
            >
              {formatters.status(caseDetails.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{caseDetails.description}</Text>

        <View style={styles.contactInfo}>
          {caseDetails.clientEmail && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactValue}>{caseDetails.clientEmail}</Text>
            </View>
          )}
          {caseDetails.clientPhone && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Teléfono:</Text>
              <Text style={styles.contactValue}>{caseDetails.clientPhone}</Text>
            </View>
          )}
        </View>

        <View style={styles.dates}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Creado:</Text>
            <Text style={styles.dateValue}>{formatters.dateTime(caseDetails.createdAt)}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Actualizado:</Text>
            <Text style={styles.dateValue}>{formatters.dateTime(caseDetails.updatedAt)}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando caso...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCaseDetails}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCaseHeader()}
        <View style={styles.notesContainer}>
          <CaseNotes
            notes={notes}
            isLoading={notesLoading}
            error={notesError}
            onRefresh={fetchNotes}
            onCreateNote={createNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray[600],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  caseType: {
    fontSize: 16,
    color: colors.gray[600],
  },
  editButton: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: colors.danger + '20',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 14,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: colors.dark,
    lineHeight: 22,
    marginBottom: 16,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[600],
    width: 80,
  },
  contactValue: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  dates: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 12,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[500],
    width: 80,
  },
  dateValue: {
    fontSize: 12,
    color: colors.gray[600],
    flex: 1,
  },
  notesContainer: {
    flex: 1,
  },
});