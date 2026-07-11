import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get('/orders/cart/');
      setCart(res.data);
    } catch {
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const addItem = async (productId, quantity = 1) => {
    const res = await api.post('/orders/cart/add/', { product_id: productId, quantity });
    setCart(res.data);
  };

  const updateItem = async (itemId, quantity) => {
    const res = await api.put(`/orders/cart/items/${itemId}/`, { quantity });
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    const res = await api.delete(`/orders/cart/items/${itemId}/remove/`);
    setCart(res.data);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
