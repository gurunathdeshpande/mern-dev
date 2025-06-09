const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// IMPORTANT: Order matters! Put specific routes before parameterized routes

// Get feedback statistics
router.get('/stats', protect, async (req, res, next) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.user.role === 'teacher') {
      query.teacher = req.user.id;
    }

    const feedback = await Feedback.find(query);
    
    // Calculate statistics
    const total = feedback.length;
    const averageRating = total > 0 
      ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1)
      : 0;
    const pending = feedback.filter(f => f.status === 'pending').length;
    const reviewed = feedback.filter(f => f.status === 'reviewed').length;

    res.json({
      success: true,
      data: {
        total,
        averageRating: parseFloat(averageRating),
        pending,
        reviewed
      }
    });
  } catch (err) {
    console.error('Error in stats route:', err);
    next(new ErrorResponse('Error fetching statistics', 500));
  }
});

// Get analytics
router.get('/analytics', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      return next(new ErrorResponse('Only teachers can access analytics', 403));
    }

    const feedback = await Feedback.find({ teacher: req.user.id })
      .populate('student', 'username firstName lastName')
      .populate('teacher', 'username firstName lastName')
      .sort({ createdAt: -1 });

    // Calculate analytics
    const totalFeedback = feedback.length;
    const averageRating = totalFeedback > 0 
      ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedback).toFixed(1)
      : 0;
    const ratingDistribution = feedback.reduce((acc, curr) => {
      acc[curr.rating] = (acc[curr.rating] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalFeedback,
        averageRating: parseFloat(averageRating),
        ratingDistribution,
        recentFeedback: feedback.slice(0, 5),
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get dashboard statistics
router.get('/dashboard-stats', protect, async (req, res, next) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.user.role === 'teacher') {
      query.teacher = req.user.id;
    }

    // Get current date and date 30 days ago
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Get all feedback and recent feedback
    const [allFeedback, recentFeedback] = await Promise.all([
      Feedback.find(query).populate('student', 'username').populate('teacher', 'username'),
      Feedback.find({
        ...query,
        createdAt: { $gte: thirtyDaysAgo }
      }).populate('student', 'username').populate('teacher', 'username')
    ]);

    // Get total users
    const totalUsers = await User.countDocuments({ role: { $in: ['student', 'teacher'] } });

    // Calculate current period stats
    const totalFeedbacks = allFeedback.length;
    const averageRating = totalFeedbacks > 0 
      ? (allFeedback.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedbacks)
      : 0;
    const pendingFeedbacks = allFeedback.filter(f => f.status === 'pending').length;
    const reviewedFeedbacks = allFeedback.filter(f => f.status === 'reviewed').length;
    const responseRate = totalFeedbacks > 0 
      ? (reviewedFeedbacks / totalFeedbacks * 100).toFixed(1)
      : 0;

    // Calculate previous period stats for growth
    const prevPeriodFeedback = allFeedback.filter(f => 
      f.createdAt < thirtyDaysAgo && 
      f.createdAt >= new Date(thirtyDaysAgo.getTime() - (30 * 24 * 60 * 60 * 1000))
    );

    const prevTotalFeedbacks = prevPeriodFeedback.length;
    const prevAverageRating = prevTotalFeedbacks > 0
      ? (prevPeriodFeedback.reduce((acc, curr) => acc + curr.rating, 0) / prevTotalFeedbacks)
      : 0;
    const prevResponseRate = prevTotalFeedbacks > 0
      ? (prevPeriodFeedback.filter(f => f.status === 'reviewed').length / prevTotalFeedbacks * 100)
      : 0;

    // Calculate growth percentages
    const feedbackGrowth = prevTotalFeedbacks > 0
      ? ((recentFeedback.length - prevTotalFeedbacks) / prevTotalFeedbacks * 100).toFixed(1)
      : 100;
    const ratingGrowth = prevAverageRating > 0
      ? ((averageRating - prevAverageRating) / prevAverageRating * 100).toFixed(1)
      : 0;
    const responseRateGrowth = prevResponseRate > 0
      ? ((responseRate - prevResponseRate) / prevResponseRate * 100).toFixed(1)
      : 0;

    // Get recent activities
    const recentActivities = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('student', 'username')
      .populate('teacher', 'username')
      .then(activities => activities.map(activity => ({
        id: activity._id,
        description: `${activity.student.username} submitted feedback for ${activity.subject}`,
        timestamp: activity.createdAt,
        status: activity.status
      })));

    res.json({
      success: true,
      data: {
        totalFeedbacks,
        averageRating: parseFloat(averageRating.toFixed(1)),
        pendingFeedbacks,
        reviewedFeedbacks,
        totalUsers,
        responseRate: parseFloat(responseRate),
        monthlyStats: {
          feedbackGrowth: parseFloat(feedbackGrowth),
          userGrowth: 0, // This would need user creation date tracking
          ratingGrowth: parseFloat(ratingGrowth),
          responseRateGrowth: parseFloat(responseRateGrowth)
        },
        recentActivities
      }
    });
  } catch (err) {
    console.error('Error in dashboard-stats route:', err);
    next(new ErrorResponse('Error fetching dashboard statistics', 500));
  }
});

// Get all feedback
router.get('/', protect, async (req, res, next) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.user.role === 'teacher') {
      query.teacher = req.user.id;
    }

    const feedback = await Feedback.find(query)
      .populate('student', 'username firstName lastName')
      .populate('teacher', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
});

// Create feedback
router.post('/', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return next(new ErrorResponse('Only students can submit feedback', 403));
    }

    const { teacher, subject, content, rating, semester, academicYear } = req.body;

    // Validate required fields
    const requiredFields = {
      teacher: 'Teacher',
      subject: 'Subject',
      content: 'Feedback content',
      rating: 'Rating',
      semester: 'Semester',
      academicYear: 'Academic year'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !req.body[field])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      return next(new ErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }

    // Validate semester
    const semesterNum = Number(semester);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return next(new ErrorResponse('Invalid semester. Must be a number between 1 and 8', 400));
    }

    // Validate academic year format
    const academicYearRegex = /^\d{4}-\d{4}$/;
    if (!academicYearRegex.test(academicYear)) {
      return next(new ErrorResponse('Invalid academic year format. Must be in YYYY-YYYY format', 400));
    }

    // Validate academic year logic
    const [startYear, endYear] = academicYear.split('-').map(Number);
    if (endYear !== startYear + 1) {
      return next(new ErrorResponse('Invalid academic year. End year must be start year + 1', 400));
    }

    // Check if teacher exists
    const teacherExists = await User.findOne({ _id: teacher, role: 'teacher' });
    if (!teacherExists) {
      return next(new ErrorResponse('Invalid teacher selected', 400));
    }

    const feedback = new Feedback({
      student: req.user.id,
      teacher,
      subject,
      content,
      rating,
      status: 'pending',
      semester: semesterNum,
      academicYear,
    });

    await feedback.save();

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('student', 'username firstName lastName')
      .populate('teacher', 'username firstName lastName');

    res.status(201).json({
      success: true,
      data: populatedFeedback,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return next(new ErrorResponse(messages.join('. '), 400));
    }
    next(err);
  }
});

// IMPORTANT: Put parameterized routes last
// Get specific feedback
router.get('/:id', protect, async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('student', 'username firstName lastName')
      .populate('teacher', 'username firstName lastName');

    if (!feedback) {
      return next(new ErrorResponse('Feedback not found', 404));
    }

    // Check if user has permission to view this feedback
    if (req.user.role === 'student') {
      if (feedback.student._id.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to view this feedback', 403));
      }
    } else if (req.user.role === 'teacher') {
      if (feedback.teacher._id.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to view this feedback', 403));
      }
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
});

// Update feedback
router.put('/:id', protect, async (req, res, next) => {
  try {
    let feedback = await Feedback.findById(req.params.id)
      .populate('student', 'username firstName lastName')
      .populate('teacher', 'username firstName lastName');

    if (!feedback) {
      return next(new ErrorResponse('Feedback not found', 404));
    }

    // Check permissions and update based on role
    if (req.user.role === 'student') {
      if (feedback.student._id.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to update this feedback', 403));
      }

      // Check if feedback is within editable timeframe (7 days)
      const feedbackAge = (Date.now() - feedback.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      if (feedbackAge > 7) {
        return next(new ErrorResponse('Feedback can only be edited within 7 days of creation', 403));
      }

      if (feedback.status !== 'pending') {
        return next(new ErrorResponse('Only pending feedback can be edited', 403));
      }

      // Validate required fields for student updates
      const requiredFields = ['content', 'rating', 'subject', 'semester', 'academicYear'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        return next(new ErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate rating
      if (req.body.rating < 1 || req.body.rating > 5) {
        return next(new ErrorResponse('Rating must be between 1 and 5', 400));
      }

      // Validate semester
      const semester = parseInt(req.body.semester);
      if (isNaN(semester) || semester < 1 || semester > 8) {
        return next(new ErrorResponse('Semester must be between 1 and 8', 400));
      }

      // Validate academic year format
      const academicYearRegex = /^\d{4}-\d{4}$/;
      if (!academicYearRegex.test(req.body.academicYear)) {
        return next(new ErrorResponse('Invalid academic year format. Must be in YYYY-YYYY format', 400));
      }

      // Validate academic year logic
      const [startYear, endYear] = req.body.academicYear.split('-').map(Number);
      if (endYear !== startYear + 1) {
        return next(new ErrorResponse('Invalid academic year. End year must be start year + 1', 400));
      }

      // Students can update these fields
      const updates = {
        content: req.body.content,
        rating: req.body.rating,
        subject: req.body.subject,
        semester: semester,
        academicYear: req.body.academicYear,
        isAnonymous: req.body.isAnonymous || false
      };

      feedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      ).populate('student', 'username firstName lastName')
       .populate('teacher', 'username firstName lastName');

    } else if (req.user.role === 'teacher') {
      if (feedback.teacher._id.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to update this feedback', 403));
      }

      // Validate teacher response length
      if (req.body.teacherResponse && req.body.teacherResponse.length > 500) {
        return next(new ErrorResponse('Teacher response cannot exceed 500 characters', 400));
      }

      // Teachers can only update status and add response
      const updates = {
        status: req.body.status || feedback.status,
        teacherResponse: req.body.teacherResponse || feedback.teacherResponse
      };

      feedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      ).populate('student', 'username firstName lastName')
       .populate('teacher', 'username firstName lastName');
    } else {
      return next(new ErrorResponse('Invalid user role', 403));
    }

    res.json({
      success: true,
      data: feedback
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return next(new ErrorResponse(messages.join('. '), 400));
    }
    next(err);
  }
});

// Delete feedback
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return next(new ErrorResponse('Feedback not found', 404));
    }

    // Check if user has permission to delete this feedback
    if (
      (req.user.role === 'student' && feedback.student.toString() !== req.user.id) ||
      (req.user.role === 'teacher' && feedback.teacher.toString() !== req.user.id)
    ) {
      return next(new ErrorResponse('Not authorized to delete this feedback', 403));
    }

    await feedback.deleteOne();

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;