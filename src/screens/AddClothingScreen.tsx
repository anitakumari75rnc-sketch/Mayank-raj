import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';

const AddClothingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState('Tops');
  const [warmth, setWarmth] = useState(3);
  const [loading, setLoading] = useState(false);

  // Mock image for now - in a real app we'd use a file input or camera API
  const mockImageUrl = `https://picsum.photos/seed/${Math.random()}/600/800`;

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const closetRef = collection(db, 'users', user.uid, 'closet');
      await addDoc(closetRef, {
        userId: user.uid,
        category,
        warmthLevel: warmth,
        imageUrl: mockImageUrl,
        createdAt: new Date().toISOString(),
      });
      navigate('/closet');
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4 -mx-2">
        <button onClick={() => navigate(-1)} className="p-2 text-primary">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-on-surface">Add Clothing</h2>
      </div>

      {/* Camera Placeholder */}
      <section className="aspect-[3/4] w-full rounded-xl bg-surface-container-low border border-outline-variant/10 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary/40">
            <Camera size={32} />
          </div>
          <p className="text-on-surface-variant font-medium text-sm tracking-wide">Tap to take a photo</p>
        </div>
        {/* Frame corners */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-outline-variant/30 rounded-tl-lg"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-outline-variant/30 rounded-tr-lg"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-outline-variant/30 rounded-bl-lg"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-outline-variant/30 rounded-br-lg"></div>
      </section>

      {/* Form */}
      <section className="space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/70 px-1">Category</label>
          <div className="relative">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest border-none rounded-lg px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
            >
              <option>Tops</option>
              <option>Bottoms</option>
              <option>Shoes</option>
              <option>Outerwear</option>
              <option>Accessories</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-primary pointer-events-none" size={20} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/70">Warmth Level</label>
            <span className="text-xs font-medium text-primary">
              {warmth === 1 ? 'Light' : warmth === 5 ? 'Heavy' : 'Medium'}
            </span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm space-y-6">
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={warmth}
              onChange={(e) => setWarmth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant/60 tracking-wider">
              <span>LIGHT & BREEZY</span>
              <span>HEAVY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <button 
        onClick={handleSave}
        disabled={loading}
        className="w-full icy-gradient text-white py-5 rounded-full font-bold text-sm tracking-widest uppercase shadow-ambient active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save to Closet'}
      </button>
    </div>
  );
};

export default AddClothingScreen;
