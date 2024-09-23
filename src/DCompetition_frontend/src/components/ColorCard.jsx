import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-hot-toast";

const Tooltip = ({ content, children, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    let timer;
    if (isLeaving) {
      timer = setTimeout(() => setIsHovered(false), 50);
    }
    return () => clearTimeout(timer);
  }, [isLeaving]);

  useEffect(() => {
    if (isVisible) {
      setIsHovered(true);
      const hideTooltip = setTimeout(() => {
        setIsHovered(false);
      }, 1000); // Tooltip hilang setelah 1 detik

      return () => clearTimeout(hideTooltip);
    }
  }, [isVisible]);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => {
        setIsLeaving(false);
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsLeaving(true)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-7 -left-9 transform bg-neutral-800 text-white text-sm py-2 px-4 rounded-lg shadow-lg"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ColorCard = ({ contest }) => {
  const [clickedColor, setClickedColor] = useState(null);

  const handleColorClick = (color) => {
    setClickedColor(color);
    navigator.clipboard.writeText(color);
    toast.success("Copied to clipboard", {
      style: {
        borderRadius: "8px",
        background: "#000",
        color: "#fff",
      },
    });
  };

  return (
    <div className="bg-neutral-900 bg-opacity-50 p-4 rounded-lg">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-white">Desired Colors</span>
        <div className="flex">
          {contest.color.map((color, colorIndex) => (
            <Tooltip
              key={colorIndex}
              content={
                <div className="flex items-center gap-2">
                  <span className="text-base uppercase">{color}</span>
                  <button
                    className="text-white rounded-full text-xs"
                    onClick={() => handleColorClick(color)}
                  >
                    <MdContentCopy className="text-base" />
                  </button>
                </div>
              }
              isVisible={clickedColor === color} // Menampilkan tooltip saat warna diklik
            >
              <span
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
                className="cursor-pointer w-6 h-6 rounded-full inline-block mx-0.5 border border-gray-500 border-opacity-80 shadow-md"
              ></span>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorCard;
