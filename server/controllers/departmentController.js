// controllers/departmentController.js
import Department from '../models/departmentModel.js';

// CREATE Department
export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const department = new Department({ name, description });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ Departments (with pagination, search, sort)
export const getDepartments = async (req, res) => {
  try {
    const { search = '', sort = 'name', order = 'asc', page = 1, limit = 5 } = req.query;

    const query = {
      name: { $regex: search, $options: 'i' },
    };

    const total = await Department.countDocuments(query);
    const departments = await Department.find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ data: departments, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateDepartment = async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
