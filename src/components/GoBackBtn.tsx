const GoBackBtn = ({ text }: { text: string }) => {
  return (
    <button
      className="text-center w-60 rounded-2xl h-14 relative text-white text-xl font-semibold group"
      type="button"
    >
      <div className="bg-indigo-600 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          height="25px"
          width="25px"
        >
          <circle
            cx="512"
            cy="300"
            r="200"
            fill="none"
            stroke="#ffffff"
            strokeWidth="40"
          />
          <rect
            x="262"
            y="500"
            width="500"
            height="400"
            rx="80"
            fill="none"
            stroke="#ffffff"
            strokeWidth="40"
          />
        </svg>
      </div>
      <p className="translate-x-4 translate-y-2 group-hover:translate-x-0 transition-transform">
        {text}
      </p>
    </button>
  );
};

export default GoBackBtn;
