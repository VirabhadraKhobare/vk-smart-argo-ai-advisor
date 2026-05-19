/**
 * Community Controller
 * Farmers discussion forum management
 */
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

exports.getPosts = async (req, res, next) => {
  try {
    const { category, search, sortBy = 'createdAt', page = 1, limit = 10 } = req.query;

    let query = { isActive: true };
    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await CommunityPost.find(query)
      .populate('author', 'name location avatar')
      .populate('comments.user', 'name avatar')
      .sort({ isPinned: -1, [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CommunityPost.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: posts
    });
  } catch (error) { next(error); }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('author', 'name location avatar')
      .populate('comments.user', 'name avatar');

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) { next(error); }
};

exports.createPost = async (req, res, next) => {
  try {
    req.body.author = req.user.id;

    const post = await CommunityPost.create(req.body);
    await post.populate('author', 'name location avatar');

    res.status(201).json({ success: true, data: post });
  } catch (error) { next(error); }
};

exports.updatePost = async (req, res, next) => {
  try {
    let post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Only author or admin can update
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post = await CommunityPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('author', 'name location avatar');

    res.status(200).json({ success: true, data: post });
  } catch (error) { next(error); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.isActive = false;
    await post.save();

    res.status(200).json({ success: true, message: 'Post removed' });
  } catch (error) { next(error); }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Check if already liked
    const alreadyLiked = post.likes.find(
      like => like.user.toString() === req.user.id
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        like => like.user.toString() !== req.user.id
      );
    } else {
      // Like
      post.likes.push({ user: req.user.id });
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likeCount: post.likes.length
    });
  } catch (error) { next(error); }
};

exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({
      user: req.user.id,
      content
    });

    await post.save();
    await post.populate('comments.user', 'name avatar');

    res.status(201).json({ success: true, data: post });
  } catch (error) { next(error); }
};
