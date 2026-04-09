import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiTruck, FiPackage } from 'react-icons/fi';
import './OrderStatusTimeline.css';

const steps = [
  { id: 1, label: 'Order Placed', icon: <FiClock /> },
  { id: 2, label: 'Picked Up', icon: <FiPackage /> },
  { id: 3, label: 'Washing', icon: <FiCheckCircle /> },
  { id: 4, label: 'Out for Delivery', icon: <FiTruck /> },
  { id: 5, label: 'Delivered', icon: <FiCheckCircle /> },
];

const OrderStatusTimeline = ({ currentStepId }) => {
  return (
    <div className="timeline-container">
      {steps.map((step, index) => {
        const isCompleted = step.id <= currentStepId;
        const isCurrent = step.id === currentStepId;
        
        return (
          <div key={step.id} className="timeline-step">
            <div className="timeline-icon-wrapper">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: isCompleted ? 1 : 0.8, opacity: isCompleted ? 1 : 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`timeline-icon ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                {step.icon}
              </motion.div>
              
              {index < steps.length - 1 && (
                <div className="timeline-connector">
                  <motion.div
                    className="timeline-connector-fill"
                    initial={{ height: 0 }}
                    animate={{ height: step.id < currentStepId ? '100%' : '0%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  />
                </div>
              )}
            </div>
            <div className={`timeline-content ${isCompleted ? 'completed-text' : ''}`}>
              <h4>{step.label}</h4>
              {isCurrent && <p>In Progress...</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTimeline;
