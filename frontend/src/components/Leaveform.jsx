import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { applyLeave } from '../api/leaveAPI.js'; // 👈 Import the new function

const LeaveForm = ({ onLeaveApplied }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await applyLeave(formData); // 👈 Use the imported function
      Swal.fire('Success', 'Leave Applied Successfully!', 'success');
      setFormData({
        employeeId: '',
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: ''
      });
      if (onLeaveApplied) {
        onLeaveApplied(); // refresh leave list
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to apply leave!', 'error');
    }
  };

  return (
    
    <div></div>
    
  );
};

export default LeaveForm;
