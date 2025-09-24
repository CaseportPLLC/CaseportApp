import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { CaseNote } from '../types';
import { colors, formatters } from '../utils';

interface CaseNotesProps {
  notes: CaseNote[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCreateNote: (content: string) => Promise<CaseNote>;
  onUpdateNote: (id: string, content: string) => Promise<CaseNote>;
  onDeleteNote: (id: string) => Promise<void>;
}

export const CaseNotes: React.FC<CaseNotesProps> = ({
  notes,
  isLoading,
  error,
  onRefresh,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNote, setEditingNote] = useState<CaseNote | null>(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCreateNote = async () => {
    if (!newNoteText.trim()) {
      Alert.alert('Error', 'El contenido de la nota no puede estar vacío');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateNote(newNoteText.trim());
      setNewNoteText('');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al crear la nota'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editNoteText.trim()) {
      Alert.alert('Error', 'El contenido de la nota no puede estar vacío');
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateNote(editingNote.id, editNoteText.trim());
      setShowEditModal(false);
      setEditingNote(null);
      setEditNoteText('');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al actualizar la nota'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = (note: CaseNote) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que deseas eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDeleteNote(note.id);
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Error al eliminar la nota'
              );
            }
          },
        },
      ]
    );
  };

  const openEditModal = (note: CaseNote) => {
    setEditingNote(note);
    setEditNoteText(note.content);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingNote(null);
    setEditNoteText('');
  };

  const renderNoteItem = ({ item }: { item: CaseNote }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteDate}>
          {formatters.dateTime(item.createdAt)}
        </Text>
        <View style={styles.noteActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Text style={styles.actionButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteNote(item)}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.noteContent}>{item.content}</Text>
      {item.updatedAt !== item.createdAt && (
        <Text style={styles.noteUpdated}>
          Editado: {formatters.dateTime(item.updatedAt)}
        </Text>
      )}
    </View>
  );

  const renderNewNoteForm = () => (
    <View style={styles.newNoteContainer}>
      <Text style={styles.sectionTitle}>Nueva Nota</Text>
      <TextInput
        style={styles.newNoteInput}
        value={newNoteText}
        onChangeText={setNewNoteText}
        placeholder="Escribe una nueva nota..."
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={1000}
      />
      <View style={styles.newNoteFooter}>
        <Text style={styles.characterCount}>
          {newNoteText.length}/1000
        </Text>
        <TouchableOpacity
          style={[
            styles.addButton,
            (!newNoteText.trim() || isSubmitting) && styles.addButtonDisabled,
          ]}
          onPress={handleCreateNote}
          disabled={!newNoteText.trim() || isSubmitting}
        >
          <Text style={styles.addButtonText}>
            {isSubmitting ? 'Agregando...' : 'Agregar Nota'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No hay notas</Text>
      <Text style={styles.emptySubtitle}>
        Agrega la primera nota para este caso
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  if (error && !notes.length) {
    return (
      <View style={styles.container}>
        {renderNewNoteForm()}
        {renderError()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderNewNoteForm()}
      
      <View style={styles.notesSection}>
        <Text style={styles.sectionTitle}>
          Notas ({notes.length})
        </Text>
        
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          style={styles.notesList}
        />
      </View>

      {/* Modal para editar nota */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Nota</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeEditModal}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TextInput
              style={styles.editNoteInput}
              value={editNoteText}
              onChangeText={setEditNoteText}
              placeholder="Contenido de la nota..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />
            <View style={styles.editNoteFooter}>
              <Text style={styles.characterCount}>
                {editNoteText.length}/1000
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={closeEditModal}
                  disabled={isSubmitting}
                >
                  <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalSaveButton,
                    (!editNoteText.trim() || isSubmitting) && styles.modalSaveButtonDisabled,
                  ]}
                  onPress={handleUpdateNote}
                  disabled={!editNoteText.trim() || isSubmitting}
                >
                  <Text style={styles.modalSaveButtonText}>
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  newNoteContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  newNoteInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.gray[50],
    minHeight: 80,
  },
  newNoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: colors.gray[500],
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  notesSection: {
    flex: 1,
    padding: 16,
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionButtonText: {
    fontSize: 16,
  },
  noteContent: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  noteUpdated: {
    fontSize: 11,
    color: colors.gray[500],
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 18,
    color: colors.gray[600],
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  editNoteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.gray[50],
  },
  editNoteFooter: {
    marginTop: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  modalCancelButtonText: {
    color: colors.gray[600],
    fontWeight: '600',
    fontSize: 14,
  },
  modalSaveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalSaveButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  modalSaveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});