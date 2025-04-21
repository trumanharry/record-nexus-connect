
import React from "react";

const DemoAccounts = () => {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      <p className="font-medium mb-2">Demo accounts:</p>
      <div className="mb-2">
        <p><strong>Email:</strong> admin@example.com (Administrator)</p>
        <p><strong>Email:</strong> distributor@example.com (Distributor)</p>
        <p><strong>Email:</strong> corporate@example.com (Corporate)</p>
        <p className="mt-2"><strong>Password:</strong> password123 (same for all demo accounts)</p>
      </div>
      
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-amber-800 font-medium">For custom accounts:</p>
        <p className="text-amber-700">Sign up with a new email and password (min 6 characters)</p>
        <p className="text-amber-700 text-xs mt-1">Note: If you created an account manually in Supabase, make sure the password is at least 6 characters</p>
      </div>
    </div>
  );
};

export default DemoAccounts;
