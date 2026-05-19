/**
 * Crop Analysis Page
 * Crop management, health monitoring, and AI recommendations
 */
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';
import { CustomLineChart } from '../components/Charts';
import { motion } from 'framer-motion';
import { Row, Col, Card, Button, Badge, Form, Modal, Table, ProgressBar } from 'react-bootstrap';
import {
  RiPlantLine, RiAddLine, RiEditLine, RiDeleteBinLine,
  RiCalendarLine, RiMapPinLine
} from 'react-icons/ri';
import { toast } from 'react-toastify';
import cropService from '../services/cropService';

const CropAnalysis = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    name: '', variety: '', fieldBlock: 'A', plantedDate: '',
    area: '', areaUnit: 'acres', status: 'planted', notes: ''
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await cropService.getCrops();
      // If no crops, use mock data for demo
      const cropData = response.data?.length > 0 ? response.data : [
        {
          _id: '1', name: 'Sugarcane', variety: 'CO-0238', fieldBlock: 'A',
          plantedDate: '2026-01-15', area: { value: 5, unit: 'acres' },
          status: 'growing', healthScore: 82, growthStage: 'vegetative',
          healthHistory: [
            { date: '2026-03-01', score: 75 },
            { date: '2026-03-15', score: 78 },
            { date: '2026-04-01', score: 80 },
            { date: '2026-04-15', score: 82 }
          ]
        },
        {
          _id: '2', name: 'Wheat', variety: 'HD-2967', fieldBlock: 'B',
          plantedDate: '2025-11-20', area: { value: 3, unit: 'acres' },
          status: 'harvesting', healthScore: 91, growthStage: 'maturity'
        },
        {
          _id: '3', name: 'Cotton', variety: 'Bt-8', fieldBlock: 'C',
          plantedDate: '2026-02-10', area: { value: 4, unit: 'acres' },
          status: 'growing', healthScore: 58, growthStage: 'flowering'
        }
      ];
      setCrops(cropData);
    } catch (error) {
      toast.error('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await cropService.updateCrop(editingCrop._id, formData);
        toast.success('Crop updated successfully');
      } else {
        await cropService.createCrop(formData);
        toast.success('Crop added successfully');
      }
      setShowModal(false);
      setEditingCrop(null);
      fetchCrops();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this crop?')) {
      try {
        await cropService.deleteCrop(id);
        toast.success('Crop removed');
        fetchCrops();
      } catch (error) {
        toast.error('Failed to remove crop');
      }
    }
  };

  const openEditModal = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      variety: crop.variety || '',
      fieldBlock: crop.fieldBlock || 'A',
      plantedDate: crop.plantedDate ? new Date(crop.plantedDate).toISOString().split('T')[0] : '',
      area: crop.area?.value || '',
      areaUnit: crop.area?.unit || 'acres',
      status: crop.status || 'planted',
      notes: crop.notes || ''
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingCrop(null);
    setFormData({
      name: '', variety: '', fieldBlock: 'A', plantedDate: '',
      area: '', areaUnit: 'acres', status: 'planted', notes: ''
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      planted: 'info', growing: 'success', flowering: 'primary',
      harvesting: 'warning', harvested: 'secondary', diseased: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'} className="rounded-pill">{status}</Badge>;
  };

  const getHealthColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    if (score >= 40) return '#ff9800';
    return '#dc3545';
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout title="Crop Analysis">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Crop Management</h4>
            <p className="text-muted mb-0">Monitor and manage your crops</p>
          </div>
          <Button
            onClick={openAddModal}
            style={{
              background: 'linear-gradient(135deg, #2d5016, #4a7c2a)',
              border: 'none', borderRadius: '12px'
            }}
          >
            <RiAddLine className="me-2" /> Add Crop
          </Button>
        </div>

        {/* AI Recommendations Alert */}
        <AlertBanner
          variant="info"
          title="AI Recommendation"
          message="Based on current weather patterns, consider increasing irrigation for cotton crops by 15% this week."
        />

        {/* Crops Grid */}
        <Row className="g-4">
          {crops.map((crop, index) => (
            <Col xl={4} md={6} key={crop._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{crop.name}</h5>
                        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                          {crop.variety && `Variety: ${crop.variety}`}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle p-2"
                          onClick={() => openEditModal(crop)}
                        >
                          <RiEditLine />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle p-2 text-danger"
                          onClick={() => handleDelete(crop._id)}
                        >
                          <RiDeleteBinLine />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Health Score</span>
                        <span className="fw-bold" style={{ color: getHealthColor(crop.healthScore) }}>
                          {crop.healthScore}%
                        </span>
                      </div>
                      <ProgressBar
                        now={crop.healthScore}
                        style={{ height: '8px', borderRadius: '4px', backgroundColor: '#e9ecef' }}
                      >
                        <ProgressBar
                          now={crop.healthScore}
                          style={{
                            backgroundColor: getHealthColor(crop.healthScore),
                            borderRadius: '4px'
                          }}
                        />
                      </ProgressBar>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {getStatusBadge(crop.status)}
                      <Badge bg="light" text="dark" className="rounded-pill">
                        <RiMapPinLine className="me-1" />Block {crop.fieldBlock}
                      </Badge>
                      <Badge bg="light" text="dark" className="rounded-pill">
                        {crop.area?.value} {crop.area?.unit}
                      </Badge>
                    </div>

                    <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '0.85rem' }}>
                      <span><RiCalendarLine className="me-1" />
                        {new Date(crop.plantedDate).toLocaleDateString()}
                      </span>
                      <span><RiPlantLine className="me-1" />{crop.growthStage}</span>
                    </div>

                    {/* Health Trend Mini Chart */}
                    {crop.healthHistory && crop.healthHistory.length > 0 && (
                      <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                        <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Health Trend</p>
                        <CustomLineChart
                          data={crop.healthHistory.map(h => ({
                            name: new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
                            score: h.score
                          }))}
                          lines={['score']}
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Crop Summary Table */}
        <Card className="mt-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">Crop Summary</h5>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>Block</th>
                    <th>Area</th>
                    <th>Status</th>
                    <th>Health</th>
                    <th>Planted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map(crop => (
                    <tr key={crop._id}>
                      <td className="fw-medium">{crop.name}</td>
                      <td>{crop.fieldBlock}</td>
                      <td>{crop.area?.value} {crop.area?.unit}</td>
                      <td>{getStatusBadge(crop.status)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <ProgressBar now={crop.healthScore} style={{ width: 60, height: 6 }}>
                            <ProgressBar now={crop.healthScore} style={{ backgroundColor: getHealthColor(crop.healthScore) }} />
                          </ProgressBar>
                          <span style={{ fontSize: '0.85rem' }}>{crop.healthScore}%</span>
                        </div>
                      </td>
                      <td>{new Date(crop.plantedDate).toLocaleDateString()}</td>
                      <td>
                        <Button variant="light" size="sm" className="me-2" onClick={() => openEditModal(crop)}>
                          <RiEditLine />
                        </Button>
                        <Button variant="light" size="sm" className="text-danger" onClick={() => handleDelete(crop._id)}>
                          <RiDeleteBinLine />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Crop Name</Form.Label>
                    <Form.Select
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    >
                      <option value="">Select crop...</option>
                      <option value="Sugarcane">Sugarcane</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Soybean">Soybean</option>
                      <option value="Onion">Onion</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Maize">Maize</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Variety</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.variety}
                      onChange={(e) => setFormData({...formData, variety: e.target.value})}
                      placeholder="e.g., CO-0238"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Field Block</Form.Label>
                    <Form.Select
                      value={formData.fieldBlock}
                      onChange={(e) => setFormData({...formData, fieldBlock: e.target.value})}
                    >
                      <option value="A">Block A</option>
                      <option value="B">Block B</option>
                      <option value="C">Block C</option>
                      <option value="D">Block D</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Planted Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.plantedDate}
                      onChange={(e) => setFormData({...formData, plantedDate: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Area</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      placeholder="Enter area"
                      required
                      min="0"
                      step="0.1"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Unit</Form.Label>
                    <Form.Select
                      value={formData.areaUnit}
                      onChange={(e) => setFormData({...formData, areaUnit: e.target.value})}
                    >
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="flowering">Flowering</option>
                  <option value="harvesting">Harvesting</option>
                  <option value="harvested">Harvested</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes..."
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="light" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" style={{ background: 'linear-gradient(135deg, #2d5016, #4a7c2a)', border: 'none' }}>
                  {editingCrop ? 'Update' : 'Add'} Crop
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default CropAnalysis;
