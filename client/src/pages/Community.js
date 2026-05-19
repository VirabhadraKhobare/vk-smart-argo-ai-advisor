/**
 * Community Page
 * Farmers discussion forum
 */
import React, { useState, useEffect } from "react";
import { RiSendPlaneLine } from "react-icons/ri";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Col, Card, Button, Badge, Form, Modal } from "react-bootstrap";
import {
  RiTeamLine,
  RiHeartLine,
  RiMessage3Line,
  RiAddLine,
  RiSearchLine,
  RiTimeLine,
} from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import communityService from "../services/communityService";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [commentText, setCommentText] = useState("");
  const [activePostId, setActivePostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await communityService.getPosts();
      // Mock data if empty
      const mockPosts = [
        {
          _id: "1",
          title: "Best practices for drip irrigation in cotton?",
          content:
            "I have 5 acres of cotton and want to switch to drip irrigation. What spacing and flow rate should I use? Any recommendations for affordable systems?",
          category: "crops",
          author: { name: "Rajesh Kumar", location: { district: "Kolhapur" } },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          likes: [{ user: "1" }, { user: "2" }],
          comments: [
            {
              user: { name: "Anil Patil" },
              content:
                "Use 60cm spacing with 4L/hour emitters. Jain Irrigation has good subsidized systems.",
              createdAt: new Date(Date.now() - 1800000).toISOString(),
            },
          ],
          views: 45,
        },
        {
          _id: "2",
          title: "PM-KISAN installment not received",
          content:
            "Its been 3 months since my last PM-KISAN installment. I checked my bank account and its linked correctly. What should I do?",
          category: "government",
          author: { name: "Suresh Jadhav", location: { district: "Pune" } },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          likes: [{ user: "1" }],
          comments: [],
          views: 120,
        },
        {
          _id: "3",
          title: "Organic pest control for soybean aphids",
          content:
            "My soybean crop has aphid infestation. I want to avoid chemical pesticides. Has anyone tried neem oil or garlic spray effectively?",
          category: "disease",
          author: { name: "Priya Sharma", location: { district: "Nashik" } },
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          likes: [{ user: "1" }, { user: "2" }, { user: "3" }],
          comments: [
            {
              user: { name: "Mahesh Desai" },
              content:
                "Neem oil 5ml/L water sprayed every 7 days works well. Add a few drops of soap as sticker.",
              createdAt: new Date(Date.now() - 5400000).toISOString(),
            },
          ],
          views: 78,
        },
      ];
      setPosts(response.data?.length > 0 ? response.data : mockPosts);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await communityService.createPost(newPost);
      toast.success("Post created successfully");
      setShowModal(false);
      setNewPost({ title: "", content: "", category: "general" });
      fetchPosts();
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    try {
      await communityService.likePost(postId);
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            const isLiked = post.likes.some((like) => like.user === "current");
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((like) => like.user !== "current")
                : [...post.likes, { user: "current" }],
            };
          }
          return post;
        }),
      );
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await communityService.addComment(postId, commentText);
      toast.success("Comment added");
      setCommentText("");
      setActivePostId(null);
      fetchPosts();
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const categories = [
    { value: "", label: "All" },
    { value: "general", label: "General" },
    { value: "crops", label: "Crops" },
    { value: "soil", label: "Soil" },
    { value: "weather", label: "Weather" },
    { value: "disease", label: "Disease" },
    { value: "market", label: "Market" },
    { value: "government", label: "Government" },
  ];

  const getCategoryColor = (cat) => {
    const colors = {
      general: "#6c757d",
      crops: "#4a7c2a",
      soil: "#8d6e63",
      weather: "#2196f3",
      disease: "#dc3545",
      market: "#ff9800",
      government: "#9c27b0",
      equipment: "#607d8b",
    };
    return colors[cat] || "#6c757d";
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout title="Community">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Farmer Community</h4>
            <p className="text-muted mb-0">
              Connect, share knowledge, and learn from fellow farmers
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            style={{
              background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
              border: "none",
              borderRadius: "12px",
            }}
          >
            <RiAddLine className="me-2" /> New Post
          </Button>
        </div>

        {/* Filters */}
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
                    placeholder="Search discussions..."
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
                    <Badge
                      key={cat.value}
                      bg="light"
                      text="dark"
                      className="rounded-pill"
                      style={{ cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      {cat.label}
                    </Badge>
                  ))}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Posts */}
        <Row className="g-3">
          {posts.map((post, index) => (
            <Col key={post._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="community-post">
                  <Card.Body>
                    <div className="post-header">
                      <div className="post-avatar">
                        {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="post-meta">
                        <div className="post-author">
                          {post.author?.name || "Anonymous"}
                        </div>
                        <div className="post-time">
                          <RiTimeLine className="me-1" />
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })}
                          {post.author?.location?.district &&
                            ` · ${post.author.location.district}`}
                        </div>
                      </div>
                      <Badge
                        style={{
                          backgroundColor: getCategoryColor(post.category),
                        }}
                        className="rounded-pill"
                      >
                        {post.category}
                      </Badge>
                    </div>

                    <h5 className="fw-bold mb-2">{post.title}</h5>
                    <p className="text-muted mb-3">{post.content}</p>

                    <div className="post-actions">
                      <button
                        className="post-action-btn"
                        onClick={() => handleLike(post._id)}
                      >
                        <RiHeartLine /> {post.likes?.length || 0} Likes
                      </button>
                      <button
                        className="post-action-btn"
                        onClick={() =>
                          setActivePostId(
                            activePostId === post._id ? null : post._id,
                          )
                        }
                      >
                        <RiMessage3Line /> {post.comments?.length || 0} Comments
                      </button>
                      <span className="post-action-btn">
                        <RiTeamLine /> {post.views} Views
                      </span>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {activePostId === post._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3"
                          style={{ borderTop: "1px solid #e9ecef" }}
                        >
                          {post.comments?.map((comment, idx) => (
                            <div key={idx} className="d-flex gap-2 mb-3">
                              <div
                                className="post-avatar"
                                style={{
                                  width: 32,
                                  height: 32,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {comment.user?.name?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </div>
                              <div>
                                <span
                                  className="fw-medium"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  {comment.user?.name}
                                </span>
                                <p
                                  className="mb-0 text-muted"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="d-flex gap-2">
                            <Form.Control
                              type="text"
                              placeholder="Write a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              style={{ borderRadius: "20px" }}
                            />
                            <Button
                              size="sm"
                              style={{
                                background:
                                  "linear-gradient(135deg, #2d5016, #4a7c2a)",
                                border: "none",
                                borderRadius: "50%",
                              }}
                              onClick={() => handleComment(post._id)}
                            >
                              <RiSendPlaneLine />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* New Post Modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreatePost}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  placeholder="What's on your mind?"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                >
                  <option value="general">General</option>
                  <option value="crops">Crops</option>
                  <option value="soil">Soil</option>
                  <option value="weather">Weather</option>
                  <option value="disease">Disease</option>
                  <option value="market">Market</option>
                  <option value="government">Government</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  placeholder="Describe your question or share your experience..."
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="light" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #2d5016, #4a7c2a)",
                    border: "none",
                  }}
                >
                  Post
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Community;
