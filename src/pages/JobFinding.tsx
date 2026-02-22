import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/api/client";

const JobFinding = () => {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/jobs")
      .then(({ data }) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    (job.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <Card className="shadow mb-6">
        <CardHeader>
          <CardTitle>Find Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)} />
            <Button variant="default"><Search className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>
      {loading ? (
        <div>Loading jobs...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center">No jobs found.</div>
          ) : (
            filteredJobs.map(job => (
              <Card key={job._id || job.id} className="flex flex-col h-full shadow border">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={job.postedBy?.profileImage || undefined} alt={job.postedBy?.name || job.company || "Profile"} />
                    <AvatarFallback>{(job.postedBy?.name || job.company || "").slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                    {job.company && (
                      <div
                        className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold transition hover:shadow-lg hover:bg-blue-200/90 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-1 inline-flex items-center"
                        style={{ boxShadow: '0 0 0 0 rgba(24, 144, 214, 0.15)' }}
                        title="Company"
                      >
                        <span className="mr-1">🏢</span> {job.company}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <MapPin className="inline w-4 h-4 mr-1" /> {job.location}
                  </div>
                  <div className="text-gray-500 text-xs">Posted: {job.createdAt ? job.createdAt.slice(0, 10) : "N/A"}</div>
                  <div className="text-green-700 font-semibold">{job.salary}</div>
                  <div className="text-gray-700 text-sm line-clamp-3">{job.description}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(job.requirements || []).slice(0, 3).map((req: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{req}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-max self-end">Apply</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobFinding;
