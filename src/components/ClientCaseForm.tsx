import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCaseSchema, CreateCaseData } from '../utils/validations';
import { CasePriority } from '../types';
import { colors, formatters } from '../utils';

interface ClientCaseFormProps {
  initialData?: Partial<CreateCaseData>;
  onSubmit: (data: CreateCaseData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const PRIORITY_OPTIONS = [
  { value: CasePriority.LOW, label: 'Baja', color: colors.info },
  { value: CasePriority.MEDIUM, label: 'Media', color: colors.warning },
  { value: CasePriority.HIGH, label: 'Alta', color: colors.danger },
  { value: CasePriority.URGENT, label: 'Urgente', color: colors.danger },
];

const CASE_TYPES = [
  'Civil',
  'Penal',
  'Laboral',
  'Comercial',
  'Familia',
  'Administrativo',
  'Constitucional',
  'Otro',
];

export const ClientCaseForm: React.FC<ClientCaseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CreateCaseData>({
    resolver: zodResolver(createCaseSchema),
    mode: 'onChange',
    defaultValues: {
      clientName: initialData?.clientName || '',
      clientEmail: initialData?.clientEmail || '',
      clientPhone: initialData?.clientPhone || '',
      caseType: initialData?.caseType || '',
      description: initialData?.description || '',
      priority: initialData?.priority || CasePriority.MEDIUM,
    },
  });

  const selectedPriority = watch('priority');

  const handleFormSubmit = async (data: CreateCaseData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error desconocido',
        [{ text: 'OK' }]
      );
    }
  };

  const renderPrioritySelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.priorityContainer}>
        {PRIORITY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.priorityOption,
              selectedPriority === option.value && styles.priorityOptionSelected,
              { borderColor: option.color },
              selectedPriority === option.value && { backgroundColor: option.color + '20' },
            ]}
            onPress={() => setValue('priority', option.value, { shouldValidate: true })}
          >
            <Text
              style={[
                styles.priorityOptionText,
                selectedPriority === option.value && { color: option.color, fontWeight: '600' },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.priority && (
        <Text style={styles.errorText}>{errors.priority.message}</Text>
      )}
    </View>
  );

  const renderCaseTypeSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Tipo de Caso</Text>
      <View style={styles.caseTypeContainer}>
        {CASE_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.caseTypeOption,
              watch('caseType') === type && styles.caseTypeOptionSelected,
            ]}
            onPress={() => setValue('caseType', type, { shouldValidate: true })}
          >
            <Text
              style={[
                styles.caseTypeOptionText,
                watch('caseType') === type && styles.caseTypeOptionTextSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.caseType && (
        <Text style={styles.errorText}>{errors.caseType.message}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? 'Editar Caso' : 'Nuevo Caso'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Cliente *</Text>
          <Controller
            control={control}
            name="clientName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.clientName && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nombre completo del cliente"
                autoCapitalize="words"
              />
            )}
          />
          {errors.clientName && (
            <Text style={styles.errorText}>{errors.clientName.message}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email del Cliente</Text>
          <Controller
            control={control}
            name="clientEmail"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.clientEmail && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="cliente@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.clientEmail && (
            <Text style={styles.errorText}>{errors.clientEmail.message}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono del Cliente</Text>
          <Controller
            control={control}
            name="clientPhone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.clientPhone && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.clientPhone && (
            <Text style={styles.errorText}>{errors.clientPhone.message}</Text>
          )}
        </View>

        {renderCaseTypeSelector()}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción del Caso *</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.description && styles.inputError,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Describe los detalles del caso..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description.message}</Text>
          )}
        </View>

        {renderPrioritySelector()}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (!isValid || isLoading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(handleFormSubmit)}
            disabled={!isValid || isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading
                ? (isEditing ? 'Guardando...' : 'Creando...')
                : (isEditing ? 'Guardar Cambios' : 'Crear Caso')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  form: {
    padding: 20,
    paddingTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityOption: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  priorityOptionSelected: {
    borderWidth: 2,
  },
  priorityOptionText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  caseTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  caseTypeOption: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
  },
  caseTypeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  caseTypeOptionText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  caseTypeOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  cancelButtonText: {
    color: colors.gray[600],
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});