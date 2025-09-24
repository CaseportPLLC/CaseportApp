import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { ClientCase, CaseStatus, CasePriority } from '../types';
import { colors, formatters } from '../utils';

interface ClientCasesListProps {
  cases: ClientCase[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCasePress: (caseId: string) => void;
  onCreateCase: () => void;
}

export const ClientCasesList: React.FC<ClientCasesListProps> = ({
  cases,
  isLoading,
  error,
  onRefresh,
  onCasePress,
  onCreateCase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'ALL'>('ALL');

  // Filtrar casos por búsqueda y estado
  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = 
      caseItem.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'ALL' || caseItem.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: CasePriority) => {
    switch (priority) {
      case CasePriority.LOW: return colors.info;
      case CasePriority.MEDIUM: return colors.warning;
      case CasePriority.HIGH: return colors.danger;
      case CasePriority.URGENT: return colors.danger;
      default: return colors.gray[500];
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.PENDING: return colors.warning;
      case CaseStatus.IN_PROGRESS: return colors.info;
      case CaseStatus.COMPLETED: return colors.success;
      case CaseStatus.CANCELLED: return colors.gray[500];
      default: return colors.gray[500];
    }
  };

  const renderCaseItem = ({ item }: { item: ClientCase }) => (
    <TouchableOpacity
      style={styles.caseCard}
      onPress={() => onCasePress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.caseHeader}>
        <View style={styles.caseHeaderLeft}>
          <Text style={styles.clientName}>{item.clientName}</Text>
          <Text style={styles.caseType}>{item.caseType}</Text>
        </View>
        <View style={styles.caseHeaderRight}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) + '20' },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(item.priority) },
              ]}
            >
              {formatters.priority(item.priority)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.caseFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {formatters.status(item.status)}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {formatters.date(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar casos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.gray[500]}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === 'ALL' && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus('ALL')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === 'ALL' && styles.filterButtonTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        
        {Object.values(CaseStatus).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === status && styles.filterButtonTextActive,
              ]}
            >
              {formatters.status(status)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {searchQuery || filterStatus !== 'ALL' ? 'No se encontraron casos' : 'No hay casos'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || filterStatus !== 'ALL'
          ? 'Intenta cambiar los filtros de búsqueda'
          : 'Crea tu primer caso para comenzar'
        }
      </Text>
      {!searchQuery && filterStatus === 'ALL' && (
        <TouchableOpacity style={styles.createButton} onPress={onCreateCase}>
          <Text style={styles.createButtonText}>Crear Primer Caso</Text>
        </TouchableOpacity>
      )}
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

  if (error && !cases.length) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCases}
        renderItem={renderCaseItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
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
        contentContainerStyle={styles.listContent}
      />
      
      <TouchableOpacity style={styles.fab} onPress={onCreateCase}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80, // Espacio para el FAB
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.gray[50],
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: 'white',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  caseCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  caseHeaderLeft: {
    flex: 1,
  },
  caseHeaderRight: {
    marginLeft: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  caseType: {
    fontSize: 14,
    color: colors.gray[600],
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
    marginBottom: 12,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '300',
  },
});