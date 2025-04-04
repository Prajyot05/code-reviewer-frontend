import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FillerBtn from "../components/FillerBtn";
import { CPagination, CPaginationItem } from "@coreui/react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import GenerateBtn from "../components/GenerateBtn";

interface Job {
  id: string;
  title: string;
  description: string;
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jobsPerPage] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      const cachedJobs = localStorage.getItem("code-reviewer-jobs");
      const cachedTimestamp = localStorage.getItem(
        "code-reviewer-jobs-timestamp"
      );

      // Check if cached data exists and if it's expired (5 minutes)
      if (cachedJobs && cachedTimestamp) {
        const now = Date.now();
        const cacheTime = Number(cachedTimestamp);
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds

        // If the cache is still valid, use it
        if (now - cacheTime < cacheExpiry) {
          const cachedData = JSON.parse(cachedJobs);
          setJobs(cachedData.jobs);
          setTotalPages(cachedData.totalPages);
          setLoading(false);
          return;
        } else {
          // If cache is expired, remove it
          localStorage.removeItem("code-reviewer-jobs");
          localStorage.removeItem("code-reviewer-jobs-timestamp");
        }
      }

      // If data is not cached or is expired, fetch from API
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/jobs`
        );
        const data = response.data.jobs as Job[];
        setJobs(data);
        setTotalPages(Math.ceil(data.length / jobsPerPage));

        // Cache the fetched data and timestamp in localStorage
        localStorage.setItem(
          "code-reviewer-jobs",
          JSON.stringify({
            jobs: data,
            totalPages: Math.ceil(data.length / jobsPerPage),
          })
        );
        localStorage.setItem(
          "code-reviewer-jobs-timestamp",
          Date.now().toString()
        );
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobsPerPage]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleRandomNavigate = () => {
    return navigate("/random");
  };

  return (
    <div className="bg-gray-900 text-white min-h-[90vh] pt-4 pb-20 px-4 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-6 text-center">All Jobs</h1>
        <GenerateBtn
          onClick={handleRandomNavigate}
          text="Generate Random Question"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <RingLoader size={100} color="#4c6ef5" loading={loading} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 px-6 py-8 rounded-lg scale-100 hover:scale-[1.02] transition-transform duration-300 max-h-[380px] flex flex-col justify-between transform hover:shadow-md hover:shadow-indigo-950/100 relative"
            >
              <h3 className="text-2xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-400 mb-4 flex-grow">{job.description}</p>
              <Link
                to={`/interview/${job.id}`}
                className="text-indigo-400 hover:text-indigo-600 font-medium mt-auto"
              >
                <FillerBtn text="Start Mock Interview" />
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-8 flex justify-center">
        <CPagination className="cursor-pointer bg-gray-800 text-white rounded-lg">
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-gray-700 text-white hover:bg-gray-600"
          >
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <CPaginationItem
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
                className={`${
                  page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {page}
              </CPaginationItem>
            )
          )}

          <CPaginationItem
            aria-label="Next"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-gray-700 text-white hover:bg-gray-600"
          >
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  );
};

export default JobList;
