import Leave from '../models/leaveModel.js';

export const applyLeave = async (req, res) => {
  try {
     const leave = new Leave({
      ...req.body,
      employeeId: req.user._id, // This is more secure and reliable
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    // ✅ THIS IS THE CORRECTED LINE
    // It now "populates" the employeeId field with the name and employeeId from the Employee collection.
    const leaves = await Leave.find({})
      .populate('employeeId', 'name employeeId')
      .sort({ appliedDate: -1 });
      
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};