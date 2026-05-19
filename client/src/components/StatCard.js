/**
 * StatCard Component
 * Reusable statistics card with icon, value, and trend
 */
import React from 'react';
import { motion } from 'framer-motion';
import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';

const StatCard = ({ 
  label, 
  value, 
  change, 
  changeType = 'positive',
  icon: Icon,
  iconColor = 'green',
  delay = 0 
}) => {
  const iconColors = {
    green: 'stat-card-icon-green',
    blue: 'stat-card-icon-blue',
    orange: 'stat-card-icon-orange',
    purple: 'stat-card-icon-purple'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="stat-card">
        <div className={`stat-card-icon ${iconColors[iconColor]}`}>
          {Icon && <Icon />}
        </div>
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {change && (
          <div className={`stat-card-change ${changeType === 'positive' ? 'stat-card-change-positive' : 'stat-card-change-negative'}`}>
            {changeType === 'positive' ? <RiArrowUpLine /> : <RiArrowDownLine />}
            {change}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
