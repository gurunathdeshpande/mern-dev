// GET /api/feedback/analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { timeRange } = req.query;
    let startDate = new Date();
    
    // Calculate start date based on time range
    switch (timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'year':
        startDate.setDate(startDate.getDate() - 365);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30); // Default to month
    }

    // Get rating distribution
    const ratingDistribution = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert rating distribution to object format
    const ratingDistObj = ratingDistribution.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Get rating trends (daily average ratings)
    const ratingTrends = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          averageRating: { $avg: "$rating" }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          averageRating: { $round: ["$averageRating", 1] }
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        ratingDistribution: ratingDistObj,
        ratingTrends
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching analytics data' 
    });
  }
}); 
 