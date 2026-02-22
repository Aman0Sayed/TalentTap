import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileData } from "@/types/user-profile";
import { useNavigate } from "react-router-dom";

export const Candidates = () => {
	const [candidates, setCandidates] = useState<UserProfileData[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCandidates = async () => {
			setLoading(true);
			try {
				const res = await fetch("http://localhost:5000/api/users");
				const users = await res.json();
				const mapped = users
					.filter((u: any) => u.role === "jobseeker")
					.map((u: any, idx: number) => ({
						id: u._id ? String(u._id) : String(idx + 1),
						name: u.name || "",
						email: u.email || "",
						title: u.title || "Candidate",
						location: u.location || "",
						connections: u.connections || Math.floor(Math.random() * 200),
						about: u.about || "",
						experience: u.experience || [],
						education: u.education || [],
						skills: u.skills || [],
						projects: u.projects || [],
						certifications: u.certifications || [],
						languages: u.languages || [],
						contact: u.contact || {
							email: u.email || "",
							phone: "",
							linkedin: "",
						},
						profileImage:
							u.profileImage ||
							`https://randomuser.me/api/portraits/men/${idx + 30}.jpg`,
						coverImage:
							u.coverImage ||
							"https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=cover&w=600&q=80",
					}));
				setCandidates(mapped);
			} catch (e) {
				setCandidates([]);
			} finally {
				setLoading(false);
			}
		};

		fetchCandidates();
	}, []);

	const filtered = candidates.filter((candidate) =>
		candidate.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<div className="mb-4">
				<Input
					type="text"
					placeholder="Search candidates..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{loading ? (
					Array.from({ length: 6 }).map((_, i) => (
						<Card key={i}>
							<CardHeader className="flex flex-row items-center gap-4">
								<Skeleton className="w-14 h-14 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-20" />
								</div>
							</CardHeader>
							<CardContent>
								<Skeleton className="h-3 w-40 mb-2" />
								<div className="flex gap-2 flex-wrap">
									<Skeleton className="h-5 w-12 rounded-full" />
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
							</CardContent>
						</Card>
					))
				) : filtered.length === 0 ? (
					<div className="col-span-full text-center text-gray-500 py-12">
						No candidates found.
					</div>
				) : (
					filtered.map((candidate) => (
						<Card
							key={candidate.id}
							className="hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() => navigate(`/candidates/${candidate.id}`)}
						>
							<CardHeader className="flex flex-row items-center gap-4">
								<Avatar className="w-14 h-14">
									<AvatarImage
										src={candidate.profileImage}
										alt={candidate.name}
									/>
								</Avatar>
								<div>
									<CardTitle className="text-lg">
										{candidate.name}
									</CardTitle>
									<div className="text-sm text-gray-500">
										{candidate.title}
									</div>
									<div className="text-xs text-gray-400">
										{candidate.location}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="mb-2 text-sm text-gray-700 line-clamp-2">
									{candidate.about}
								</div>
								<div className="flex gap-2 flex-wrap">
									{candidate.skills
										.slice(0, 4)
										.map((skill, i) => (
											<Badge key={i} variant="secondary">
												{skill}
											</Badge>
										))}
									{candidate.skills.length > 4 && (
										<Badge variant="outline">
											+{candidate.skills.length - 4} more
										</Badge>
									)}
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
};