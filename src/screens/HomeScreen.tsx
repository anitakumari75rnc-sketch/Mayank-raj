import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Thermometer, Wind, Umbrella, CloudRain } from 'lucide-react';
import { getStylingSuggestion, StylingSuggestion } from '../services/geminiService';

const HomeScreen: React.FC = () => {
  const [suggestion, setSuggestion] = useState<StylingSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const data = await getStylingSuggestion();
        setSuggestion(data);
      } catch (error) {
        console.error('Failed to fetch suggestion:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestion();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-32 bg-surface-container-low rounded-xl"></div>
        <div className="h-12 w-3/4 bg-surface-container-low rounded-lg"></div>
        <div className="h-64 bg-surface-container-low rounded-xl"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      {/* Weather Widget */}
      <section>
        <div className="glass-widget rounded-xl p-6 flex items-center justify-between border border-white/20 shadow-ambient">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Current Atmosphere</p>
            <h2 className="text-3xl font-light text-on-surface">
              {suggestion?.weatherInfo.temp} <span className="text-on-surface-variant text-lg">and {suggestion?.weatherInfo.condition}</span>
            </h2>
          </div>
          <div className="bg-primary-container/30 p-3 rounded-full text-primary">
            <Sun size={32} />
          </div>
        </div>
      </section>

      {/* Editorial Headline */}
      <section>
        <motion.h3 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-[42px] font-bold leading-none tracking-tight text-on-surface mb-2"
        >
          {suggestion?.headline.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              {word} {i === 0 ? <br /> : ''}
            </React.Fragment>
          ))}
        </motion.h3>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">{suggestion?.subheadline}</p>
      </section>

      {/* Featured Outfit Card (Asymmetric) */}
      <section className="relative">
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-ambient overflow-hidden min-h-[420px]">
          {/* Floating Item 1 */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="absolute -top-4 -right-8 w-56 h-56 transform rotate-12 transition-transform duration-500"
          >
            <div className="bg-surface-container-low p-4 rounded-xl shadow-sm">
              <img 
                className="w-full h-full object-cover rounded-lg mix-blend-multiply" 
                src="https://picsum.photos/seed/clothing1/400/400" 
                alt="Recommended Item"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Floating Item 2 */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="absolute bottom-12 -left-6 w-48 h-48 transform -rotate-6 transition-transform duration-500"
          >
            <div className="bg-surface-container-low p-4 rounded-xl shadow-sm">
              <img 
                className="w-full h-full object-cover rounded-lg mix-blend-multiply" 
                src="https://picsum.photos/seed/clothing2/400/400" 
                alt="Recommended Item"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Card Content */}
          <div className="absolute bottom-8 right-8 text-right">
            <div className="inline-flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">THE LOOK</span>
              <h4 className="text-xl font-bold text-on-surface">
                {suggestion?.recommendedItems[0]} <br /> & {suggestion?.recommendedItems[1]}
              </h4>
              <div className="mt-4 h-[2px] w-12 bg-primary"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-lg p-5 flex flex-col justify-between h-40">
          <Wind size={24} className="text-primary" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Suggestion</p>
            <p className="text-sm font-semibold">{suggestion?.description.split('.')[0]}</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-lg p-5 flex flex-col justify-between h-40">
          <Sun size={24} className="text-primary" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Protection</p>
            <p className="text-sm font-semibold">UV Index: {suggestion?.weatherInfo.uvIndex}</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomeScreen;
