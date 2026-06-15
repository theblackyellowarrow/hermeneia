import { useState, useEffect, useCallback } from 'react';
import { ANNOTATIONS_STORAGE_KEY } from '../utils/constants';

export function useAnnotations() {
  const [annotations, setAnnotations] = useState([]);
  const [annotationSearch, setAnnotationSearch] = useState('');
  const [newAnnotation, setNewAnnotation] = useState({
    term: '', translation: '', note: '', source: '', confidence: 'medium',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ANNOTATIONS_STORAGE_KEY);
      if (saved) setAnnotations(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load annotations', e);
    }
  }, []);

  const addAnnotation = useCallback((e, currentPageIndex) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newAnnotation.term.trim() || !newAnnotation.translation.trim()) return;

    const annotation = {
      id: Date.now(),
      term: newAnnotation.term.trim(),
      translation: newAnnotation.translation.trim(),
      note: newAnnotation.note.trim(),
      source: newAnnotation.source.trim(),
      confidence: newAnnotation.confidence,
      pageNum: currentPageIndex,
      createdAt: new Date().toISOString(),
    };

    setAnnotations(prev => {
      const updated = [annotation, ...prev];
      localStorage.setItem(ANNOTATIONS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setNewAnnotation({ term: '', translation: '', note: '', source: '', confidence: 'medium' });
  }, [newAnnotation]);

  const removeAnnotation = useCallback((id) => {
    setAnnotations(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem(ANNOTATIONS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const filteredAnnotations = annotations.filter(a =>
    !annotationSearch ||
    a.term.toLowerCase().includes(annotationSearch.toLowerCase()) ||
    a.translation.toLowerCase().includes(annotationSearch.toLowerCase()) ||
    a.note.toLowerCase().includes(annotationSearch.toLowerCase()) ||
    a.source.toLowerCase().includes(annotationSearch.toLowerCase())
  );

  return {
    annotations,
    annotationSearch,
    setAnnotationSearch,
    newAnnotation,
    setNewAnnotation,
    addAnnotation,
    removeAnnotation,
    filteredAnnotations,
  };
}
