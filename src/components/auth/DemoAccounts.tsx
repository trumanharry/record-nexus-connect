
import React from "react";

const DemoAccounts = () => {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      <p className="font-medium mb-2">Demo accounts:</p>
      <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p><strong>Email:</strong> admin@example.com</p>
        <p><strong>Password:</strong> password123</p>
        <p className="text-xs mt-1">Role: Administrator</p>
        
        <div className="border-t border-blue-200 my-2"></div>
        
        <p><strong>Email:</strong> distributor@example.com</p>
        <p><strong>Password:</strong> password123</p>
        <p className="text-xs mt-1">Role: Distributor</p>
        
        <div className="border-t border-blue-200 my-2"></div>
        
        <p><strong>Email:</strong> corporate@example.com</p>
        <p><strong>Password:</strong> password123</p>
        <p className="text-xs mt-1">Role: Corporate</p>
      </div>
      
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-amber-800 font-medium">For custom accounts:</p>
        <p className="text-amber-700">Sign up with a new email and password (min 6 characters)</p>
        <p className="text-amber-700 text-xs mt-1">Note: Custom passwords must be at least 6 characters</p>
      </div>
    </div>
  );
};

export default DemoAccounts;
