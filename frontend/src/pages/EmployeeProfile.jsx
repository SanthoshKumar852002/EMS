import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem('employee'));
    if (emp) {
      axios.get(`/api/employees/${emp._id}`).then(res => {
        setEmployee(res.data);
      });
    }
  }, []);

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2>Welcome, {employee.name}</h2>
      <p>Email: {employee.email}</p>
      <p>Department: {employee.department}</p>
      <p>DOB: {employee.dob}</p>
      {/* Edit Option */}
    </div>
  );
};

export default EmployeeProfile;
