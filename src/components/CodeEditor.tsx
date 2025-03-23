import React, { useState, useEffect } from "react";
import ControlledEditor from "@monaco-editor/react";
import Select from "react-select";
import axios from "axios";

interface CodeEditorProps {
  onSubmit: (code: string, language: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onSubmit }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [languages, setLanguages] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    axios
      // .get(`${import.meta.env.VITE_BACKEND_URL}/api/languages`)
      .get("https://api.plapi.io/programming-languages/?year-gte=2001")
      .then((response) => {
        const langOptions = response.data.map((lang: string) => ({
          value: lang.toLowerCase(),
          label: lang.charAt(0).toUpperCase() + lang.slice(1),
        }));
        console.log(langOptions);
        setLanguages(langOptions);
      })
      .catch((error) => console.error("Error fetching languages:", error));
  }, []);

  const handleSubmit = () => {
    onSubmit(code, language);
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <div className="mb-6">
        <label htmlFor="language" className="block text-xl font-medium mb-2">
          Language:
        </label>
        <Select
          id="language"
          options={languages}
          value={languages.find((lang) => lang.value === language)}
          onChange={(selectedOption) =>
            setLanguage((selectedOption as { value: string }).value)
          }
          className="text-black"
        />
      </div>

      {/* Monaco Code Editor */}
      <ControlledEditor
        value={code}
        onChange={(value) => setCode(value || "")}
        language={language}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          fontSize: 14,
          minimap: { enabled: false },
        }}
        className="w-full h-80 mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-4 rounded-lg transition duration-300"
      >
        Submit Code
      </button>
    </div>
  );
};

export default CodeEditor;
