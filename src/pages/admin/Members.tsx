import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/api';
import { Edit, Trash2 } from 'lucide-react';

interface Member {
  user_id: string;
  role: string;
  role_assigned_at: string;
  email: string;
  user_created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_details')
        .select('*')
        .order('role_assigned_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Members</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Members</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Members</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-6">Manage your team members, assign roles, and oversee employee activities.</p>

        {/* Member list */}
        <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
        {members.length === 0 ? (
          <p className="text-gray-600">No members found.</p>
        ) : (
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Joined</th>
                <th className="text-left p-3">Last Sign In</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.user_id} className="border-b">
                  <td className="p-3">{member.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      member.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-3">{new Date(member.user_created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    {member.last_sign_in_at 
                      ? new Date(member.last_sign_in_at).toLocaleDateString()
                      : 'Never'
                    }
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit member"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Placeholder for actions */}
        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Invite Member
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Refresh List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Members;