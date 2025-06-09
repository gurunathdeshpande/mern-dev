const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: [
        'Data Structures and Algorithms',
        'Object-Oriented Programming',
        'Database Management Systems',
        'Operating Systems',
        'Computer Networks',
        'Software Engineering',
        'Web Development',
        'Artificial Intelligence',
        'Machine Learning',
        'Computer Architecture',
        'Theory of Computation',
        'Compiler Design',
        'Computer Graphics',
        'Cryptography and Network Security',
        'Cloud Computing',
        'Big Data Analytics',
        'Mobile App Development',
        'Digital Logic Design',
        'Discrete Mathematics',
        'Python Programming'
      ],
    },
    content: {
      type: String,
      required: [true, 'Feedback content is required'],
      minlength: [10, 'Feedback content must be at least 10 characters long'],
      maxlength: [1000, 'Feedback content cannot exceed 1000 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'archived'],
      default: 'pending',
    },
    teacherResponse: {
      type: String,
      maxlength: [500, 'Teacher response cannot exceed 500 characters'],
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8']
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      validate: {
        validator: function(v) {
          return /^\d{4}-\d{4}$/.test(v);
        },
        message: props => `${props.value} is not a valid academic year format (YYYY-YYYY)!`
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        if (ret.isAnonymous) {
          delete ret.student;
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
feedbackSchema.index({ teacher: 1, createdAt: -1 });
feedbackSchema.index({ student: 1, createdAt: -1 });
feedbackSchema.index({ subject: 1 });
feedbackSchema.index({ status: 1 });

// Virtual for feedback age
feedbackSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to ensure teacher and student are different users
feedbackSchema.pre('save', async function(next) {
  if (this.teacher.toString() === this.student.toString()) {
    throw new Error('Teacher and student cannot be the same user');
  }
  next();
});

// Static method to get feedback statistics for a teacher
feedbackSchema.statics.getTeacherStats = async function(teacherId) {
  const stats = await this.aggregate([
    { $match: { teacher: mongoose.Types.ObjectId(teacherId) } },
    {
      $group: {
        _id: null,
        totalFeedback: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        subjectCounts: {
          $push: {
            subject: '$subject',
            count: 1,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalFeedback: 1,
        averageRating: { $round: ['$averageRating', 1] },
        subjectBreakdown: '$subjectCounts',
      },
    },
  ]);

  return stats[0] || {
    totalFeedback: 0,
    averageRating: 0,
    subjectBreakdown: [],
  };
};

// Method to check if feedback can be edited
feedbackSchema.methods.canEdit = function(userId, userRole) {
  if (userRole === 'student') {
    return (
      this.student.toString() === userId &&
      this.status === 'pending' &&
      this.age < 7 // Can edit within 7 days
    );
  }
  if (userRole === 'teacher') {
    return this.teacher.toString() === userId;
  }
  return false;
};

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;