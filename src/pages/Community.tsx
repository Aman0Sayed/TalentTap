import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import api from "@/api/client";

const Community = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/users")
      .then(({ data }) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md animate-slide-down">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl font-bold text-blue-800 drop-shadow-sm">
              <Users className="w-7 h-7 text-indigo-600" /> Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-lg font-medium text-blue-700">Loading users...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {users.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500">No users found.</div>
                ) : (
                  users.map(user => (
                    <Card key={user._id || user.id} className="flex flex-col h-full shadow-lg border-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50 hover:scale-[1.025] hover:shadow-2xl transition-transform duration-200">
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <Avatar className="w-14 h-14 shadow border-2 border-indigo-200">
                          <AvatarImage src={user.profileImage || undefined} alt={user.name || 'Profile'} />
                          <AvatarFallback>{(user.name || '').slice(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-semibold text-blue-900">{user.name}</CardTitle>
                          <div className="text-indigo-700 text-sm capitalize font-medium">{user.role}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col gap-2">
                        <div className="text-gray-500 text-xs truncate">{user.email}</div>
                        <div className="text-gray-700 text-sm line-clamp-2 min-h-[2.5em]">{user.about}</div>
                        <div className="text-gray-300 text-xs">User ID: {user._id || user.id}</div>
                        <div className="mt-3 flex justify-end">
                          <Link to={`/CommunityProfile/${user._id || user.id}`} className="w-full">
                            <Button size="sm" variant="secondary" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:from-blue-600 hover:to-indigo-600 transition-colors">View Profile</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
            <div className="mt-8 text-center text-gray-500 text-base font-medium">Share your experiences, ask questions, and connect with other job seekers!</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
