
import React from "react";

const DemoAccounts = () => {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      <p className="font-medium mb-2">Demo accounts:</p>
      <p>admin@example.com (Administrator)</p>
      <p>distributor@example.com (Distributor)</p>
      <p>corporate@example.com (Corporate)</p>
      <p className="mt-2">Password: <span className="font-medium">password123</span> for all demo accounts</p>
      <p className="mt-4">Or sign up with a new email and password (min 6 characters)</p>
    </div>
  );
};

export default DemoAccounts;
