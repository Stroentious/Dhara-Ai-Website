import React, { createContext, useState, useContext, useEffect } from 'react';
import { fieldsAPI } from '../services/api';
import { mockField } from '../data/mockData';

const FieldContext = createContext();

export const useField = () => useContext(FieldContext);

export const FieldProvider = ({ children }) => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFields = async () => {
    setIsLoading(true);
    try {
      const res = await fieldsAPI.list().catch(() => null);
      if (res && res.data && res.data.length > 0) {
        setFields(res.data);
        if (!selectedField) setSelectedField(res.data[0]);
      } else {
        // Mock fallback
        setFields([mockField]);
        if (!selectedField) setSelectedField(mockField);
      }
    } catch (error) {
      console.error("Failed to fetch fields", error);
      setFields([mockField]);
      if (!selectedField) setSelectedField(mockField);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return (
    <FieldContext.Provider value={{ fields, selectedField, setSelectedField, fetchFields, isLoading }}>
      {children}
    </FieldContext.Provider>
  );
};
