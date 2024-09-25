import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";

function Home() {
  return (
    <div className="absolute top-0 left-0 w-screen min-h-screen flex flex-col justify-center items-center text-white overflow-hidden px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-3xl sm:text-4xl md:text-6xl md:leading-tight font-bold leading-tight mb-6"
        >
          Unleash Creativity, <br />
          <span className="text-purple-300">Share Your Vision</span>, and Win
          Big!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-lg mb-8 leading-relaxed"
        >
          Compete in art and logo challenges on a blockchain-powered platform.
          Fair voting, verified users, and crypto rewards await. Let your
          creativity shine!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <Button
            radius="full"
            className="w-60 h-12 bg-purple-600 hover:bg-purple-500 text-md font-semibold"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="relative mt-12 z-10"
      >
        {/* <img
          src="https://firebasestorage.googleapis.com/v0/b/linkasa-a354b.appspot.com/o/testes.png?alt=media&token=7d7ecf89-e751-43be-8a4e-2ccf83804bab"
          alt="Creative Competition"
          className="w-48 h-auto rounded-lg"
        /> */}
      </motion.div>
    </div>
  );
}

export default Home;
