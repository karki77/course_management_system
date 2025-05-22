import { pagination } from '../utils/pagination/pagination';
import { User } from '../models/User';

/**
 * Get all enrolled users with pagination
 */
export const getAllEnrolledUsers = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const { page, limit } = req.query;

    // Get total count
    const totalCount = await User.countDocuments({ isEnrolled: true });

    // Apply pagination
    const { pagination: paginationParams, meta } = pagination(
      { page, limit },
      totalCount,
    );

    // Fetch users with pagination
    const users = await User.find({ isEnrolled: true })
      .skip(paginationParams.skip)
      .limit(paginationParams.limit);

    // Return paginated response
    return res.status(200).json({
      success: true,
      data: users,
      pagination: meta,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch enrolled users',
    });
  }
};
