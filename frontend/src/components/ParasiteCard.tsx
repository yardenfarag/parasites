import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, AlertTriangle, MapPin, Clock, Shield } from 'lucide-react';
import type { Parasite } from '../types/parasite';

interface ParasiteCardProps {
  parasite: Parasite;
}

const ParasiteCard: React.FC<ParasiteCardProps> = ({ parasite }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'protozoa': return 'border-worm-pink bg-worm-pink/10';
      case 'nematode': return 'border-worm-purple bg-worm-purple/10';
      case 'bacteria': return 'border-worm-blue bg-worm-blue/10';
      case 'virus': return 'border-parasite-blood bg-parasite-blood/10';
      case 'fungus': return 'border-parasite-slime bg-parasite-slime/10';
      default: return 'border-parasite-green bg-parasite-green/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'protozoa': return '🦠';
      case 'nematode': return '🐛';
      case 'bacteria': return '🧬';
      case 'virus': return '🦠';
      case 'fungus': return '🍄';
      default: return '🔬';
    }
  };

  return (
    <motion.div
      className={`relative bg-parasite-decay/30 border rounded-lg overflow-hidden transition-all duration-300 ${getCategoryColor(parasite.category)}`}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={parasite.image}
          alt={parasite.name}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-parasite-dark/80 to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-parasite-dark/80 px-2 py-1 rounded-full">
          <span className="text-lg">{getCategoryIcon(parasite.category)}</span>
          <span className="text-xs font-medium text-parasite-green">{parasite.category}</span>
        </div>

        {/* Hover overlay */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-parasite-green/20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ExternalLink className="w-8 h-8 text-parasite-green" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-parasite-green mb-1">
            {parasite.name}
          </h3>
          <p className="text-sm text-parasite-green/70 line-clamp-2">
            {parasite.description}
          </p>
        </div>

        {/* Symptoms */}
        {parasite.symptoms && parasite.symptoms.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-parasite-blood">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">Symptoms</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {parasite.symptoms.slice(0, 3).map((symptom, index) => (
                <span
                  key={index}
                  className="text-xs bg-parasite-blood/20 text-parasite-blood px-2 py-1 rounded"
                >
                  {symptom}
                </span>
              ))}
              {parasite.symptoms.length > 3 && (
                <span className="text-xs text-parasite-green/70">
                  +{parasite.symptoms.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Habitat */}
        <div className="flex items-start space-x-2 text-parasite-slime">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{parasite.habitat}</span>
        </div>

        {/* Lifecycle */}
        <div className="flex items-start space-x-2 text-parasite-green/70">
          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{parasite.lifecycle}</span>
        </div>
      </div>

      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 border-2 border-parasite-green/50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default ParasiteCard;
