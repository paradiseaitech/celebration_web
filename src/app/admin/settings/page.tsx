"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-navy">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your admin profile</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-lg">
        <h2 className="text-xl font-semibold text-navy">Profile</h2>
        <Input label="Email" value={user?.email || ""} disabled />
        <Input label="Role" value={user?.user_metadata?.role || "menu_manager"} disabled />
        <p className="text-sm text-gray-500">
          Contact the super admin to change your role or reset password.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-lg">
        <h2 className="text-xl font-semibold text-navy">Change Password</h2>
        <PasswordChangeForm />
      </div>
    </div>
  );
}

function PasswordChangeForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="At least 6 characters"
      />
      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Re-enter password"
      />
      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
      <Button type="submit" className="bg-navy text-white hover:bg-navy-light">
        Update Password
      </Button>
    </form>
  );
}
