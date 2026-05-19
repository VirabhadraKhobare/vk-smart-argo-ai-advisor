/**
 * NotFound Page
 * 404 error page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { RiSeedlingLine, RiArrowLeftLine } from 'react-icons/ri';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #f8faf5 0%, #e8f5e9 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div
          className="d-inline-flex align-items-center justify-content-center mb-4"
          style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            color: '#2d5016', fontSize: '3rem'
          }}
        >
          <RiSeedlingLine />
        </div>
        <h1 className="fw-bold mb-2" style={{ fontSize: '4rem', color: '#2d5016' }}>404</h1>
        <h3 className="fw-semibold mb-3">Page Not Found</h3>
        <p className="text-muted mb-4" style={{ maxWidth: 400, margin: '0 auto' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/dashboard">
          <Button
            style={{
              background: 'linear-gradient(135deg, #2d5016, #4a7c2a)',
              border: 'none', borderRadius: '12px', padding: '0.75rem 2rem'
            }}
          >
            <RiArrowLeftLine className="me-2" /> Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
