import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  description: string;
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Job Listings</h1>
      <ul className="space-y-6">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold mb-2">{job.title}</h3>
            <p className="text-gray-400 mb-4">{job.description}</p>
            <Link
              to={`/interview/${job.id}`}
              className="text-indigo-400 hover:text-indigo-600 font-medium"
            >
              Start Mock Interview
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
