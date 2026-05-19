/**
 * Government Schemes Page
 * Display farming schemes, subsidies, and benefits
 */
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import {
  Row,
  Col,
  Card,
  Badge,
  Form,
  Accordion,
  Button,
} from "react-bootstrap";
import {
  RiGovernmentLine,
  RiSearchLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiBankCardLine,
  RiGraduationCapLine,
  RiHandCoinLine,
  RiExternalLinkLine,
  RiPhoneLine,
  RiMailLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import govService from "../services/govService";

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await govService.getSchemes();
      setSchemes(response.data || []);
    } catch (error) {
      toast.error("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "", label: "All Categories", icon: RiGovernmentLine },
    { value: "subsidy", label: "Subsidies", icon: RiHandCoinLine },
    { value: "insurance", label: "Insurance", icon: RiShieldCheckLine },
    { value: "loan", label: "Loans", icon: RiBankCardLine },
    { value: "grant", label: "Grants", icon: RiMoneyDollarCircleLine },
    { value: "training", label: "Training", icon: RiGraduationCapLine },
  ];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      !searchQuery ||
      scheme.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || scheme.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.icon : RiGovernmentLine;
  };

  const getCategoryColor = (category) => {
    const colors = {
      subsidy: "#4a7c2a",
      insurance: "#17a2b8",
      loan: "#ffc107",
      grant: "#9c27b0",
      training: "#ff9800",
      other: "#6c757d",
    };
    return colors[category] || "#6c757d";
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout title="Government Schemes">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Government Schemes</h4>
          <p className="text-muted mb-0">
            Explore subsidies, insurance, loans, and benefits for farmers
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col md={6}>
                <div className="position-relative">
                  <RiSearchLine
                    className="position-absolute"
                    style={{
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                    }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Search schemes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-5"
                    style={{ borderRadius: "12px" }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <Button
                      key={cat.value}
                      variant={
                        categoryFilter === cat.value ? "success" : "light"
                      }
                      size="sm"
                      className="rounded-pill"
                      onClick={() => setCategoryFilter(cat.value)}
                    >
                      <cat.icon className="me-1" />
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Schemes Grid */}
        <Row className="g-4">
          {filteredSchemes.map((scheme, index) => {
            const Icon = getCategoryIcon(scheme.category);
            const color = getCategoryColor(scheme.category);

            return (
              <Col lg={6} key={scheme._id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="scheme-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "10px",
                              background: `${color}15`,
                              color: color,
                            }}
                          >
                            <Icon size={20} />
                          </div>
                          <div>
                            <Badge
                              style={{ backgroundColor: color }}
                              className="rounded-pill mb-1"
                            >
                              {scheme.category?.toUpperCase()}
                            </Badge>
                            <h5
                              className="fw-bold mb-0"
                              style={{ fontSize: "1.1rem" }}
                            >
                              {scheme.shortName || scheme.name}
                            </h5>
                          </div>
                        </div>
                        <Badge
                          bg={
                            scheme.status === "active" ? "success" : "secondary"
                          }
                          className="rounded-pill"
                        >
                          {scheme.status}
                        </Badge>
                      </div>

                      <p
                        className="text-muted mb-3"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {scheme.description}
                      </p>

                      <Accordion className="mb-3">
                        <Accordion.Item
                          eventKey="0"
                          style={{ border: "none", background: "transparent" }}
                        >
                          <Accordion.Button
                            style={{
                              background: "transparent",
                              padding: "0.5rem 0",
                              fontSize: "0.9rem",
                              fontWeight: 600,
                            }}
                          >
                            Benefits & Details
                          </Accordion.Button>
                          <Accordion.Body className="px-0">
                            {scheme.benefits?.length > 0 && (
                              <div className="mb-3">
                                <h6
                                  className="fw-bold mb-2"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  Benefits:
                                </h6>
                                <ul className="mb-0">
                                  {scheme.benefits.map((benefit, idx) => (
                                    <li
                                      key={idx}
                                      style={{ fontSize: "0.85rem" }}
                                    >
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {scheme.eligibility && (
                              <div className="mb-3">
                                <h6
                                  className="fw-bold mb-2"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  Eligibility:
                                </h6>
                                <p style={{ fontSize: "0.85rem" }}>
                                  {scheme.eligibility}
                                </p>
                              </div>
                            )}

                            {scheme.documentsRequired?.length > 0 && (
                              <div className="mb-3">
                                <h6
                                  className="fw-bold mb-2"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  Documents Required:
                                </h6>
                                <div className="d-flex flex-wrap gap-2">
                                  {scheme.documentsRequired.map((doc, idx) => (
                                    <Badge
                                      key={idx}
                                      bg="light"
                                      text="dark"
                                      className="rounded-pill"
                                      style={{ fontSize: "0.75rem" }}
                                    >
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {scheme.applicationProcess && (
                              <div>
                                <h6
                                  className="fw-bold mb-2"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  How to Apply:
                                </h6>
                                <p
                                  style={{
                                    fontSize: "0.85rem",
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  {scheme.applicationProcess}
                                </p>
                              </div>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      <div
                        className="d-flex justify-content-between align-items-center pt-3"
                        style={{ borderTop: "1px solid #e9ecef" }}
                      >
                        <div
                          className="d-flex gap-3"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {scheme.contactInfo?.phone && (
                            <span className="text-muted">
                              <RiPhoneLine className="me-1" />
                              {scheme.contactInfo.phone}
                            </span>
                          )}
                          {scheme.contactInfo?.email && (
                            <span className="text-muted">
                              <RiMailLine className="me-1" />
                              {scheme.contactInfo.email}
                            </span>
                          )}
                        </div>
                        {scheme.websiteUrl && (
                          <Button
                            variant="light"
                            size="sm"
                            className="rounded-pill"
                            href={scheme.websiteUrl}
                            target="_blank"
                          >
                            <RiExternalLinkLine className="me-1" />
                            Visit
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default GovernmentSchemes;
