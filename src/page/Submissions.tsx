import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import FillerBtn from "../components/FillerBtn";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/features";
import { RingLoader } from "react-spinners";

interface Submission {
  _id: string;
  questionName: string;
  question: string;
  createdAt: string;
}

const SubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Use a ref to track loading state synchronously
  const loadingRef = useRef(false);

  const fetchSubmissions = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true; // Lock the fetching process
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("auth-token");

    const cachedSubmissions = localStorage.getItem("code-reviewer-submissions");
    const cachedTimestamp = localStorage.getItem(
      "code-reviewer-submissions-timestamp"
    );

    if (cachedSubmissions && cachedTimestamp) {
      const now = Date.now();
      const cacheTime = Number(cachedTimestamp);
      const cacheExpiry = 5 * 60 * 1000;

      // If the cache is still valid, use it
      if (now - cacheTime < cacheExpiry) {
        const cachedData = JSON.parse(cachedSubmissions);
        setSubmissions(cachedData.submissions);
        setHasMore(cachedData.hasMore);
        setIsLoading(false);
        loadingRef.current = false;
        return;
      } else {
        // If cache is expired, remove it
        localStorage.removeItem("code-reviewer-submissions");
        localStorage.removeItem("code-reviewer-submissions-timestamp");
      }
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/submissions`,
        {
          params: { page: currentPage },
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      const { data } = response;

      if (data.success) {
        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          setSubmissions((prev) => [...prev, ...data.data]);
          setCurrentPage((prev) => prev + 1);
        }

        // Cache the fetched data and timestamp in localStorage
        localStorage.setItem(
          "code-reviewer-submissions",
          JSON.stringify({
            submissions: [...submissions, ...data.data],
            hasMore: data.data.length > 0,
          })
        );
        localStorage.setItem(
          "code-reviewer-submissions-timestamp",
          Date.now().toString()
        );
      } else {
        setError("Failed to load submissions.");
      }
    } catch (err) {
      setError("Error fetching submissions.");
    } finally {
      loadingRef.current = false; // Release the lock
      setIsLoading(false);
    }
  }, [currentPage, hasMore]);

  // Use a threshold to trigger loading a bit earlier (e.g. 100px above the bottom)
  const handleScroll = useCallback(() => {
    const threshold = 100;
    const scrolledFromTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.offsetHeight;

    if (scrolledFromTop + windowHeight + threshold >= fullHeight) {
      fetchSubmissions();
    }
  }, [fetchSubmissions]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navigate = useNavigate();

  const handleOnClick = (id: string) => {
    return navigate(`/submission/${id}`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-[90vh] pt-4 pb-20 px-4 relative">
      <h1 className="text-4xl font-bold mb-6 text-center">All Submissions</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="bg-gray-800 px-6 py-8 rounded-lg scale-100 hover:scale-[1.02] transition-transform duration-300 max-h-[380px] flex flex-col justify-between transform hover:shadow-md hover:shadow-indigo-950/100 relative"
          >
            <h3 className="text-2xl font-semibold mb-2">
              {submission.questionName}
            </h3>
            <p className="text-gray-400 mb-4 flex-grow">
              {submission.question.length > 60
                ? `${submission.question.substring(0, 60)}...`
                : submission.question}
            </p>
            <div className="text-green-300 text-sm mb-4">
              <strong>Submitted At: </strong>
              {formatDate(submission.createdAt)}
            </div>
            <FillerBtn
              text="View Submission"
              onClickHandler={() => handleOnClick(submission._id)}
            />
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="flex justify-center items-center mt-20">
          <RingLoader size={60} color="#4c6ef5" loading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
