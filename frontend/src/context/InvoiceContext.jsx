import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/invoices/my', { 
        withCredentials: true 
      });
      
      if (response.data && Array.isArray(response.data)) {
        // Merge new invoices with existing state to preserve UI stability
        setInvoices(prev => response.data.map(newInv => {
          const existing = prev.find(i => i._id === newInv._id);
          return existing ? {...existing, ...newInv} : newInv;
        }));
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <InvoiceContext.Provider 
      value={{ 
        invoices,
        isLoading,
        error,
        refreshInvoices,
        setInvoices
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);