/**
 * Soil Health Page
 * Soil analysis, nutrient tracking, and AI fertilizer recommendations
 */
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { Row, Col, Card, Button, Badge, Form, ProgressBar, Table } from 'react-bootstrap';
import {
  RiAddLine, RiFlaskLine, RiTestTubeLine,
  RiDropLine, RiFireLine, RiSunLine, RiWaterFlashLine
} from 'react-icons/ri';
import { toast } from 'react-toastify';
import soilService from '../services/soilService';

const SoilHealth = () => {
  const [reports, setReports] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fieldBlock: 'A',
    nitrogen: '', phosphorus: '', potassium: '',
    ph: '', moisture: '', organicMatter: '',
    texture: 'loamy', testedBy: '', notes: ''
  });

  useEffect(() => {
    fetchSoilData();
  }, []);

  const fetchSoilData = async () => {
    try {
      setLoading(true);
      const [reportsRes, latestRes] = await Promise.all([
        soilService.getReports().catch(() => null),
        soilService.getLatest().catch(() => null)
      ]);

      // Mock data if empty
      const mockReports = [
        {
          _id: '1', fieldBlock: 'A', testDate: '2026-04-15',
          nutrients: {
            nitrogen: { value: 180, status: 'medium' },
            phosphorus: { value: 45, status: 'low' },
            potassium: { value: 220, status: 'medium' }
          },
          ph: { value: 6.8, status: 'neutral' },
          moisture: { value: 42, unit: '%' },
          organicMatter: { value: 2.8, unit: '%' },
          texture: 'loamy',
          overallHealth: { score: 72, status: 'good' },
          aiRecommendations: [
            { nutrient: 'Phosphorus', recommendation: 'Apply Single Super Phosphate', quantity: '40-50 kg/ha', priority: 'high' },
            { nutrient: 'Nitrogen', recommendation: 'Apply Urea', quantity: '50-60 kg/ha', priority: 'medium' }
          ]
        },
        {
          _id: '2', fieldBlock: 'B', testDate: '2026-03-20',
          nutrients: {
            nitrogen: { value: 120, status: 'low' },
            phosphorus: { value: 55, status: 'medium' },
            potassium: { value: 180, status: 'low' }
          },
          ph: { value: 7.2, status: 'neutral' },
          moisture: { value: 38, unit: '%' },
          organicMatter: { value: 2.2, unit: '%' },
          texture: 'sandy-loam',
          overallHealth: { score: 58, status: 'fair' },
          aiRecommendations: [
            { nutrient: 'Potassium', recommendation: 'Apply Muriate of Potash', quantity: '30-40 kg/ha', priority: 'high' },
            { nutrient: 'Nitrogen', recommendation: 'Apply Ammonium Nitrate', quantity: '60-70 kg/ha', priority: 'high' }
          ]
        }
      ];

      const reportData = reportsRes?.data || mockReports;
      setReports(reportData);
      setLatestReport(latestRes?.data || mockReports[0]);
    } catch (error) {
      toast.error('Failed to load soil data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportData = {
        fieldBlock: formData.fieldBlock,
        nutrients: {
          nitrogen: { value: parseFloat(formData.nitrogen), status: getNutrientStatus('nitrogen', formData.nitrogen) },
          phosphorus: { value: parseFloat(formData.phosphorus), status: getNutrientStatus('phosphorus', formData.phosphorus) },
          potassium: { value: parseFloat(formData.potassium), status: getNutrientStatus('potassium', formData.potassium) }
        },
        ph: { value: parseFloat(formData.ph), status: getPhStatus(formData.ph) },
        moisture: { value: parseFloat(formData.moisture), unit: '%' },
        organicMatter: { value: parseFloat(formData.organicMatter), unit: '%' },
        texture: formData.texture,
        testedBy: formData.testedBy,
        notes: formData.notes
      };

      await soilService.createReport(reportData);
      toast.success('Soil report added successfully');
      setShowForm(false);
      fetchSoilData();
    } catch (error) {
      toast.error('Failed to add soil report');
    }
  };

  const getNutrientStatus = (nutrient, value) => {
    const thresholds = {
      nitrogen: { low: 140, medium: 200, high: 280 },
      phosphorus: { low: 10, medium: 25, high: 40 },
      potassium: { low: 120, medium: 200, high: 300 }
    };
    const t = thresholds[nutrient];
    if (value < t.low) return 'low';
    if (value < t.medium) return 'medium';
    if (value < t.high) return 'high';
    return 'optimal';
  };

  const getPhStatus = (value) => {
    if (value < 6.0) return 'acidic';
    if (value > 7.5) return 'alkaline';
    return 'neutral';
  };

  const getStatusColor = (status) => {
    const colors = { low: '#dc3545', medium: '#ffc107', high: '#17a2b8', optimal: '#28a745' };
    return colors[status] || '#6c757d';
  };

  const getHealthColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    if (score >= 40) return '#ff9800';
    return '#dc3545';
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout title="Soil Health">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Soil Health Analysis</h4>
            <p className="text-muted mb-0">Monitor soil nutrients and get AI recommendations</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            style={{ background: 'linear-gradient(135deg, #2d5016, #4a7c2a)', border: 'none', borderRadius: '12px' }}
          >
            <RiAddLine className="me-2" /> {showForm ? 'Cancel' : 'Add Report'}
          </Button>
        </div>

        {/* Add Report Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
            <Card>
              <Card.Body>
                <h5 className="fw-bold mb-3">New Soil Test Report</h5>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Field Block</Form.Label>
                        <Form.Select value={formData.fieldBlock} onChange={(e) => setFormData({...formData, fieldBlock: e.target.value})}>
                          <option value="A">Block A</option>
                          <option value="B">Block B</option>
                          <option value="C">Block C</option>
                          <option value="D">Block D</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nitrogen (kg/ha)</Form.Label>
                        <Form.Control type="number" value={formData.nitrogen} onChange={(e) => setFormData({...formData, nitrogen: e.target.value})} required />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phosphorus (kg/ha)</Form.Label>
                        <Form.Control type="number" value={formData.phosphorus} onChange={(e) => setFormData({...formData, phosphorus: e.target.value})} required />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Potassium (kg/ha)</Form.Label>
                        <Form.Control type="number" value={formData.potassium} onChange={(e) => setFormData({...formData, potassium: e.target.value})} required />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>pH Level</Form.Label>
                        <Form.Control type="number" step="0.1" min="0" max="14" value={formData.ph} onChange={(e) => setFormData({...formData, ph: e.target.value})} required />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Moisture (%)</Form.Label>
                        <Form.Control type="number" min="0" max="100" value={formData.moisture} onChange={(e) => setFormData({...formData, moisture: e.target.value})} required />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Organic Matter (%)</Form.Label>
                        <Form.Control type="number" step="0.1" value={formData.organicMatter} onChange={(e) => setFormData({...formData, organicMatter: e.target.value})} />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Soil Texture</Form.Label>
                        <Form.Select value={formData.texture} onChange={(e) => setFormData({...formData, texture: e.target.value})}>
                          <option value="sandy">Sandy</option>
                          <option value="loamy">Loamy</option>
                          <option value="clay">Clay</option>
                          <option value="silty">Silty</option>
                          <option value="sandy-loam">Sandy Loam</option>
                          <option value="clay-loam">Clay Loam</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="light" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button type="submit" style={{ background: 'linear-gradient(135deg, #2d5016, #4a7c2a)', border: 'none' }}>
                      Save Report
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Overall Health Score */}
        {latestReport && (
          <Row className="g-4 mb-4">
            <Col lg={4}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="text-center h-100">
                  <Card.Body className="d-flex flex-column justify-content-center">
                    <h6 className="text-muted mb-3">Overall Soil Health</h6>
                    <div className="position-relative d-inline-block mx-auto mb-3">
                      <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="#e9ecef" strokeWidth="12" />
                        <circle cx="80" cy="80" r="70" fill="none" stroke={getHealthColor(latestReport.overallHealth.score)}
                          strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={`${latestReport.overallHealth.score * 4.4} 440`}
                          strokeDashoffset="110"
                          transform="rotate(-90 80 80)"
                        />
                      </svg>
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <span className="d-block fw-bold" style={{ fontSize: '2.5rem', color: getHealthColor(latestReport.overallHealth.score) }}>
                          {latestReport.overallHealth.score}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Score</span>
                      </div>
                    </div>
                    <Badge bg={latestReport.overallHealth.status === 'excellent' ? 'success' : latestReport.overallHealth.status === 'good' ? 'info' : 'warning'}
                      className="rounded-pill mx-auto" style={{ width: 'fit-content' }}>
                      {latestReport.overallHealth.status.toUpperCase()}
                    </Badge>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Nutrient Cards */}
            <Col lg={8}>
              <Row className="g-3">
                {['nitrogen', 'phosphorus', 'potassium'].map((nutrient, idx) => {
                  const data = latestReport.nutrients[nutrient];
                  const icons = { nitrogen: RiFlaskLine, phosphorus: RiTestTubeLine, potassium: RiFireLine };
                  const Icon = icons[nutrient];
                  const maxValues = { nitrogen: 300, phosphorus: 60, potassium: 350 };
                  const percentage = (data.value / maxValues[nutrient]) * 100;

                  return (
                    <Col md={4} key={nutrient}>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <Card className="h-100">
                          <Card.Body>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <div style={{ color: getStatusColor(data.status) }}>
                                <Icon size={24} />
                              </div>
                              <h6 className="mb-0 fw-semibold text-capitalize">{nutrient}</h6>
                            </div>
                            <h3 className="fw-bold mb-2" style={{ color: getStatusColor(data.status) }}>
                              {data.value}
                            </h3>
                            <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>kg/ha</p>
                            <ProgressBar now={Math.min(percentage, 100)} style={{ height: '6px' }}>
                              <ProgressBar now={Math.min(percentage, 100)} style={{ backgroundColor: getStatusColor(data.status) }} />
                            </ProgressBar>
                            <Badge bg="light" text="dark" className="mt-2 rounded-pill" style={{ fontSize: '0.75rem' }}>
                              {data.status}
                            </Badge>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}

                {/* pH and Moisture */}
                <Col md={6}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="h-100">
                      <Card.Body>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <RiDropLine size={24} style={{ color: '#17a2b8' }} />
                          <h6 className="mb-0 fw-semibold">pH Level</h6>
                        </div>
                        <h3 className="fw-bold mb-2" style={{ color: '#17a2b8' }}>{latestReport.ph.value}</h3>
                        <Badge bg={latestReport.ph.status === 'neutral' ? 'success' : 'warning'} className="rounded-pill">
                          {latestReport.ph.status}
                        </Badge>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
                <Col md={6}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="h-100">
                      <Card.Body>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <RiWaterFlashLine size={24} style={{ color: '#2196f3' }} />
                          <h6 className="mb-0 fw-semibold">Moisture</h6>
                        </div>
                        <h3 className="fw-bold mb-2" style={{ color: '#2196f3' }}>{latestReport.moisture.value}%</h3>
                        <ProgressBar now={latestReport.moisture.value} style={{ height: '6px' }}>
                          <ProgressBar now={latestReport.moisture.value} style={{ backgroundColor: '#2196f3' }} />
                        </ProgressBar>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {/* AI Recommendations */}
        {latestReport?.aiRecommendations && (
          <Card className="mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <RiSunLine style={{ color: '#ff9800' }} />
                AI Fertilizer Recommendations
              </h5>
              <Row className="g-3">
                {latestReport.aiRecommendations.map((rec, idx) => (
                  <Col md={6} lg={4} key={idx}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                      <div className="p-3 rounded-3" style={{ background: rec.priority === 'high' ? '#fff3e0' : '#e8f5e9', border: `1px solid ${rec.priority === 'high' ? '#ffe0b2' : '#c8e6c9'}` }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg={rec.priority === 'high' ? 'danger' : 'success'} className="rounded-pill">
                            {rec.priority.toUpperCase()} PRIORITY
                          </Badge>
                        </div>
                        <h6 className="fw-bold mb-1">{rec.nutrient}</h6>
                        <p className="mb-1" style={{ fontSize: '0.9rem' }}>{rec.recommendation}</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                          <strong>Quantity:</strong> {rec.quantity}
                        </p>
                      </div>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Reports History */}
        <Card>
          <Card.Body>
            <h5 className="fw-bold mb-3">Soil Test History</h5>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Block</th>
                    <th>N (kg/ha)</th>
                    <th>P (kg/ha)</th>
                    <th>K (kg/ha)</th>
                    <th>pH</th>
                    <th>Moisture</th>
                    <th>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report._id}>
                      <td>{new Date(report.testDate).toLocaleDateString()}</td>
                      <td>{report.fieldBlock}</td>
                      <td style={{ color: getStatusColor(report.nutrients.nitrogen.status) }}>{report.nutrients.nitrogen.value}</td>
                      <td style={{ color: getStatusColor(report.nutrients.phosphorus.status) }}>{report.nutrients.phosphorus.value}</td>
                      <td style={{ color: getStatusColor(report.nutrients.potassium.status) }}>{report.nutrients.potassium.value}</td>
                      <td>{report.ph.value}</td>
                      <td>{report.moisture.value}%</td>
                      <td>
                        <Badge style={{ backgroundColor: getHealthColor(report.overallHealth.score) }} className="rounded-pill">
                          {report.overallHealth.score}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SoilHealth;
