import React from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Button from "../components/ui/Button";

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Store the direction in sessionStorage before navigating
    sessionStorage.setItem("pageTransition", "right");
    navigate("/login");
  };

  return (
    <PageTransition direction="left">
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to Your To-Do List</h1>
        <p className="text-md text-gray-600 mb-8">
          Organize your tasks, boost your productivity, and never miss a deadline again.
        </p>
        <Button onClick={handleLoginClick} variant="primary" size="large">
          Get Started
        </Button>
      </div>
    </PageTransition>
  );
}

export default Home;