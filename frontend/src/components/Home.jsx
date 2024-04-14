import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TypeWriterComponent from "typewriter-effect";

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // if the user is not logged in, take them to login page
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("token_data"))) {
      navigate("/login", {
        state: { message: "You have to be logged in to view the home page" },
      });
    } else {
      setIsLoading(false);
    }
  });

  if (isLoading) {
    return <div className="error">Loading...</div>;
  }

  return (
    <div>
      {/* hero section */}
      <section className="bg-gray-100 text-black flex flex-col items-center justify-center h-[90vh] sm:px-0">
        <h1 className="text-2xl mb-2 md:text-3xl lg:text-5xl">
          Discover the Weather App of the Future
        </h1>
        <div className="mb-5 text-lg md:text-xl text-[#fb6f92]">
          <TypeWriterComponent
            options={{
              strings: [
                "Get accurate weather forecasts for any city, anytime.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
        <div>
          <button className="bg-[#14213d] hover:bg-[#2b2d42] text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/weather")}
          >
            Explore🚀
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
