import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";

const Interview: React.FC = () => {
  const { jobId } = useParams();
  const [output, setOutput] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = async (code: string, language: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/code/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        }
      );
      const data = await res.json();
      setOutput(data.output);
      setReview(data.review);
    } catch (error) {
      console.error("Error submitting code:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="flex space-x-8">
        {/* Left side with Job details */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">
            Coding Question for Job {jobId}
          </h2>
          <p className="text-gray-400">Write a function to reverse a string.</p>
        </div>

        {/* Right side with Code Editor and Output */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <CodeEditor onSubmit={handleSubmit} />
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Output</h3>
            <pre className="bg-gray-700 p-4 rounded-lg overflow-x-auto">
              {output}
            </pre>
            <h3 className="text-xl font-semibold mt-6 mb-2">AI Review</h3>
            <pre className="bg-gray-700 p-4 rounded-lg overflow-x-auto">
              {review}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
