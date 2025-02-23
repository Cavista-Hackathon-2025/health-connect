import React, { useState, useEffect } from "react";

const Doctor = () => {
  const [tips, setTips] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          'https://fc78-102-221-239-130.ngrok-free.app/healthconnect/patient-ai-generated-result/',
          {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              'Authorization':'Bearer 3b0013d4a2d2ce1355add964780626bc988177ee',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.ok) {
          const data = await response.json();
          setTips(data);
        }
      } catch (err) {
        console.error("Error fetching tips:", err);
        setError({
          message:
            err instanceof Error ? err.message : "Failed to load health tips",
          code: "FETCH_ERROR",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, []);

  console.log(tips);
  return <div>Doctor</div>;
};

export default Doctor;
