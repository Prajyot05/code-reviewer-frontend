import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";

const Interview = ({
  mode,
}: {
  mode: "interview" | "submission" | "random";
}) => {
  const { id } = useParams();
  const [output, setOutput] = useState("");
  const [review, setReview] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [question, setQuestion] = useState("");
  const [compileStatus, setCompileStatus] = useState("");
  const [timeUsed, setTimeUsed] = useState(0);
  const [memoryUsed, setMemoryUsed] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [codeLoading, setCodeLoading] = useState(false);
  const [code, setCode] = useState("");
  const outputRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const fetchJobQuestion = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/jobs/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        if (!res.data.success) {
          toast.error("Failed to fetch Question");
          return;
        }
        setQuestionName(res.data.question.name);
        setQuestion(res.data.question.question);
      } catch (error) {
        console.log("Error fetching Job Question: ", error);
        toast.error("Failed to fetch Question");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchSubmissionDetails = async () => {
      const token = localStorage.getItem("auth-token");
      setIsLoading(true);
      if (!token) {
        setError("No authentication token found.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/submissions/${id}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setQuestionName(res.data.submission.questionName);
        setQuestion(res.data.submission.question);
        setReview(res.data.submission.review);
        setCode(res.data.submission.prompt);
      } catch (err) {
        console.error("Error fetching submission details:", err);
        setError("Error fetching submission details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchRandomQuestion = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/jobs/random`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        if (!res.data.success) {
          toast.error("Failed to fetch Question");
          return;
        }
        setQuestionName(res.data.name);
        setQuestion(res.data.question);
      } catch (error) {
        console.log("Error fetching Random Question: ", error);
        toast.error("Failed to fetch Question");
      } finally {
        setIsLoading(false);
      }
    };
    if (mode == "interview") fetchJobQuestion();
    else if (mode == "submission") fetchSubmissionDetails();
    else if (mode == "random") fetchRandomQuestion();
  }, [id, mode]);

  const handleCompilation = async (code: string, language: string) => {
    setCodeLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/code/compile`,
        {
          code,
          language,
        }
      );
      if (response.data.success) {
        setError("");
        const { compileStatus, output, timeUsed, memoryUsed } = response.data;

        setCompileStatus(compileStatus);
        setOutput(String(output));
        setTimeUsed(timeUsed);
        setMemoryUsed(memoryUsed);

        if (outputRef.current) {
          outputRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          window.scrollBy(0, 500);
        }
      } else {
        console.error("Compilation failed:", response.data.message);
        setError(response.data.compileStatus);
      }
    } catch (error) {
      console.error("Error during compilation:", error);
      setError("An error occurred while compiling the code.");
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSubmit = async (code: string, language: string) => {
    setCodeLoading(true);
    const token = localStorage.getItem("auth-token");

    if (!token) {
      console.error("No authentication token found.");
      setCodeLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/code/submit`,
        {
          prompt: code,
          language,
          questionName,
          question,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      const data = res.data;
      setReview(data.message);
      toast.success("Saved Submission");

      // Remove submissions cache
      localStorage.removeItem("code-reviewer-submissions");
      localStorage.removeItem("code-reviewer-submissions-timestamp");

      // Scroll to the review section after the review is set
      if (reviewRef.current) {
        reviewRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start", // Aligns the element to the top of the page
        });
        // Additional scroll after the element is in view to move it up or down
        window.scrollBy(0, 700);
      }
    } catch (error: any) {
      console.error("Error submitting code:", error);
      toast.error("Failed to Submit Code");
      if (error.response) {
        console.error("Server responded with:", error.response.data.message);
      } else {
        console.error("Error with request:", error.message);
      }
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="flex mt-2 space-x-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-[70vh] w-[40%]">
            <RingLoader size={100} color="#4c6ef5" loading={isLoading} />
          </div>
        ) : (
          <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg w-[40%]">
            <h2 className="text-3xl font-semibold mb-4">{questionName}</h2>
            <p className="text-gray-400">{question}</p>
          </div>
        )}

        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg relative w-[60%]">
          <CodeEditor
            onSubmit={handleSubmit}
            onCompile={handleCompilation}
            loading={isLoading}
            originalCode={code}
          />
          {(isLoading || codeLoading) && (
            <div className="z-20 absolute top-0 left-0 right-0 bottom-0 bg-black opacity-60 flex justify-center items-center rounded-lg">
              <span className="text-white text-3xl font-semibold">
                Processing...
              </span>
            </div>
          )}

          <div className="mt-6 space-y-5">
            <h3 className="text-xl font-semibold mb-2">Output</h3>
            <div
              ref={outputRef}
              className="bg-gray-700 p-4 rounded-lg overflow-x-auto"
            >
              <p className="text-red-400">{error}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {output}
              </ReactMarkdown>
            </div>
            {compileStatus && (
              <div className="mt-4">
                <p className="text-lg font-semibold">
                  Compilation Status:{" "}
                  <span className="text-green-300">{compileStatus}</span>
                </p>
                <div className="flex justify-between">
                  <p className="text-lg">
                    Time Used:{" "}
                    <span className="text-green-300">{timeUsed} seconds</span>
                  </p>
                  <p className="text-lg">
                    Memory Used:{" "}
                    <span className="text-green-300">{memoryUsed} MB</span>
                  </p>
                </div>
              </div>
            )}
            <h3 className="text-xl font-semibold mt-6 mb-2">Code Review</h3>
            <div
              ref={reviewRef}
              className="bg-gray-700 p-4 rounded-lg overflow-x-auto space-y-4"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {review}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
