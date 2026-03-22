import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Shirt, Filter } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';

interface ClothingItem {
  id: string;
  category: string;
  warmthLevel: number;
  imageUrl: string;
  name?: string;
}

const ClosetScreen: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Tops', 'Bottoms', 'Shoes', 'Outerwear'];

  useEffect(() => {
    if (!user) return;

    const closetRef = collection(db, 'users', user.uid, 'closet');
    const q = query(closetRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const closetItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClothingItem[];
      setItems(closetItems);
    });

    return unsubscribe;
  }, [user]);

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = !search || item.category.toLowerCase().includes(search.toLowerCase()) || (item.name?.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <section>
        <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 shadow-sm">
          <Search size={20} className="text-on-surface-variant/60 mr-3" />
          <input 
            type="text" 
            placeholder="Search your pieces..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Filter Chips */}
      <section className="overflow-x-auto no-scrollbar -mx-8 px-8">
        <div className="flex space-x-3 w-max">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
                filter === cat 
                  ? 'bg-primary-container text-primary' 
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Page Heading */}
      <section>
        <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-2">Closet</h2>
        <p className="text-sm text-on-surface-variant/80">{filteredItems.length} pieces curated for your style.</p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div 
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-surface-container-low flex items-center justify-center p-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.category} 
                  className="object-contain mix-blend-multiply opacity-90 w-full h-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{item.category}</p>
                <p className="text-xs font-medium text-on-surface">{item.name || `${item.category} Item`}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* FAB */}
      <Link 
        to="/add"
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/40 z-50 transition-transform active:scale-90"
      >
        <Plus size={28} />
      </Link>
    </div>
  );
};

export default ClosetScreen;
