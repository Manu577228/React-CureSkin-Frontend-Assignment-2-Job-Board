import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [jobIds, setJobIds] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchJobIds();
  }, []);

  useEffect(() => {
    fetchJobDetails();
  }, [jobIds, currentPage]);

  const fetchJobIds = async () => {
    try {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      const data = await response.json();
      setJobIds(data);
    } catch (error) {
      console.error("Error fetching job IDs:", error);
    }
  };

  const fetchJobDetails = async () => {
    try {
      const startIndex = (currentPage - 1) * 6;
      const endIndex = startIndex + 6;
      const jobsToFetch = jobIds.slice(startIndex, endIndex);

      const promises = jobsToFetch.map(async (jobId) => {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`
        );
        const jobDetail = await response.json();
        return jobDetail;
      });

      const newJobDetails = await Promise.all(promises);
      setJobDetails((prevJobDetails) => [...prevJobDetails, ...newJobDetails]);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const loadMoreJobs = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="app-container">
      <h1>Bharadwaj Job Board</h1>
      {jobDetails.slice(0, currentPage * 6).map((job) => (
        <div key={job.id} className="job-post">
          <div className="job-title">
            {job.url ? (
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                {job.title}
              </a>
            ) : (
              <span>{job.title}</span>
            )}
          </div>
          <div className="job-info">
            <div>{`Poster: ${job.by}`}</div>
            <div>{`Date Posted: ${new Date(
              job.time * 1000
            ).toLocaleString()}`}</div>
          </div>
        </div>
      ))}
      {jobIds.length > jobDetails.length && (
        <div className="button-container">
          <button className="load-more-btn" onClick={loadMoreJobs}>
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
