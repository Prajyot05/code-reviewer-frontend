import React, { useEffect, useState } from "react";
import ControlledEditor from "@monaco-editor/react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import { toast } from "react-toastify";
import FillerBtn from "./FillerBtn";

interface CodeEditorProps {
  onSubmit: (code: string, language: string) => void;
  onCompile: (code: string, language: string) => void;
  loading: boolean;
  originalCode: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  onSubmit,
  onCompile,
  loading,
  originalCode,
}) => {
  const [code, setCode] = useState<string>(
    originalCode === "" ? `// Start writing your code here!` : originalCode
  );
  const [language, setLanguage] = useState("C");

  useEffect(() => {
    setCode(originalCode);
  }, [originalCode]);

  const languages = [
    { value: "C", label: "C" },
    { value: "CPP14", label: "C++14" },
    { value: "CPP17", label: "C++17" },
    { value: "CLOJURE", label: "Clojure" },
    { value: "CSHARP", label: "C#" },
    { value: "GO", label: "Go" },
    { value: "HASKELL", label: "Haskell" },
    { value: "JAVA8", label: "Java 8" },
    { value: "JAVA14", label: "Java 14" },
    { value: "JAVASCRIPT_NODE", label: "JavaScript(Nodejs)" },
    { value: "KOTLIN", label: "Kotlin" },
    { value: "OBJECTIVEC", label: "Objective C" },
    { value: "PASCAL", label: "Pascal" },
    { value: "PERL", label: "Perl" },
    { value: "PHP", label: "PHP" },
    { value: "PYTHON", label: "Python 2" },
    { value: "PYTHON3", label: "Python 3" },
    { value: "PYTHON3_8", label: "Python 3.8" },
    { value: "R", label: "R" },
    { value: "RUBY", label: "Ruby" },
    { value: "RUST", label: "Rust" },
    { value: "SCALA", label: "Scala" },
    { value: "SWIFT", label: "Swift" },
    { value: "TYPESCRIPT", label: "TypeScript" },
  ];

  const handleSubmit = () => {
    if (!code) {
      toast.warn("Write some code first");
      return;
    }
    onSubmit(code, language);
  };

  const handleCompilation = () => {
    onCompile(code, language);
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <div className="mb-6 flex justify-end">
        <CDropdown>
          <CDropdownToggle color="secondary">
            {languages.find((lang) => lang.value === language)?.label ||
              "Select Language"}
          </CDropdownToggle>
          <CDropdownMenu style={{ maxHeight: "200px", overflowY: "auto" }}>
            {languages.map((lang) => (
              <CDropdownItem
                key={lang.value}
                className="cursor-pointer"
                onClick={() => setLanguage(lang.value)}
              >
                {lang.label}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>
      </div>
      {/* <div className="mb-6">
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
      </div> */}

      <ControlledEditor
        value={code}
        onChange={(value) => setCode(value || "")}
        language={language}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          wrappingIndent: "same",
          scrollbar: {
            vertical: "auto",
            horizontal: "hidden",
          },
        }}
        className="w-full h-96 mb-4 rounded-lg"
      />

      <div className="flex w-full justify-between">
        <FillerBtn
          text="Run Code"
          onClickHandler={loading ? undefined : handleCompilation}
        />
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Submit Code
        </button>

        {/* <button
          onClick={handleReview}
          className="cursor-pointer bg-green-600 hover:bg-green-800 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Get Review
        </button> */}
      </div>
    </div>
  );
};

export default CodeEditor;
