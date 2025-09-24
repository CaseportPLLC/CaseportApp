import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ClientCase, CreateCaseData, CaseNote, CreateNoteData } from '../types';

// Hook para manejar casos de clientes
export const useCases = () => {
  const [cases, setCases] = useState<ClientCase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los casos
  const fetchCases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const casesData = await apiService.getCases();
      setCases(casesData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar los casos');
    } finally {
      setIsLoading(false);
    }
  };

  // Crear un nuevo caso
  const createCase = async (caseData: CreateCaseData) => {
    try {
      setError(null);
      const newCase = await apiService.createCase(caseData);
      setCases(prev => [newCase, ...prev]);
      return newCase;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el caso';
      setError(errorMessage);
      throw error;
    }
  };

  // Actualizar un caso existente
  const updateCase = async (id: string, caseData: Partial<CreateCaseData>) => {
    try {
      setError(null);
      const updatedCase = await apiService.updateCase(id, caseData);
      setCases(prev => prev.map(c => c.id === id ? updatedCase : c));
      return updatedCase;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el caso';
      setError(errorMessage);
      throw error;
    }
  };

  // Eliminar un caso
  const deleteCase = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteCase(id);
      setCases(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el caso';
      setError(errorMessage);
      throw error;
    }
  };

  // Obtener caso por ID
  const getCaseById = async (id: string) => {
    try {
      setError(null);
      return await apiService.getCaseById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el caso';
      setError(errorMessage);
      throw error;
    }
  };

  // Cargar casos al montar el hook
  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    isLoading,
    error,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
    getCaseById,
  };
};

// Hook para manejar notas de casos
export const useCaseNotes = (caseId: string) => {
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener notas del caso
  const fetchNotes = async () => {
    if (!caseId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const notesData = await apiService.getCaseNotes(caseId);
      setNotes(notesData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar las notas');
    } finally {
      setIsLoading(false);
    }
  };

  // Crear una nueva nota
  const createNote = async (content: string) => {
    try {
      setError(null);
      const noteData: CreateNoteData = { content, caseId };
      const newNote = await apiService.createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la nota';
      setError(errorMessage);
      throw error;
    }
  };

  // Actualizar una nota
  const updateNote = async (id: string, content: string) => {
    try {
      setError(null);
      const updatedNote = await apiService.updateNote(id, content);
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
      return updatedNote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la nota';
      setError(errorMessage);
      throw error;
    }
  };

  // Eliminar una nota
  const deleteNote = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la nota';
      setError(errorMessage);
      throw error;
    }
  };

  // Cargar notas al cambiar el caseId
  useEffect(() => {
    fetchNotes();
  }, [caseId]);

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
};