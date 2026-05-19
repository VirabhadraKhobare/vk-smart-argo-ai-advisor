/**
 * Minimal Notifications Page - for testing
 */
import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card } from "react-bootstrap";

const Notifications = () => {
  return (
    <DashboardLayout title="Notifications">
      <div className="p-4">
        <Card>
          <Card.Body>
            <h4>Notifications</h4>
            <p>Notifications feature coming soon...</p>
          </Card.Body>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
