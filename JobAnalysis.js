let jobData = [];

// Handle JSON file upload
document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        jobData = JSON.parse(event.target.result);
        displayJobs(jobData);
        populateFilterOptions();
      } catch (error) {
        alert("Invalid JSON file. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  }
});

// Display job listings
function displayJobs(jobs) {
  const jobListings = document.getElementById("jobListings");
  jobListings.innerHTML = ""; // Clear previous listings
  jobs.forEach((job) => {
    const jobElement = document.createElement("div");
    jobElement.className = "job";
    jobElement.innerHTML = `
      <h2>${job.Title}</h2>
      <p><strong>Posted:</strong> ${job.Posted}</p>
      <p><strong>Type:</strong> ${job.Type}</p>
      <p><strong>Level:</strong> ${job.Level}</p>
      <p><strong>Skill:</strong> ${job.Skill}</p>
      <p><strong>Details:</strong> ${job.Detail}</p>
      <a href="${job["Job Page Link"]}" target="_blank">Job Page Link</a>
    `;
    jobListings.appendChild(jobElement);
  });
}

// Populate filter options dynamically
function populateFilterOptions() {
  const filterCriteria = document.getElementById("filterCriteria");
  const filterOptions = document.getElementById("filterOptions");
  filterOptions.innerHTML = ""; // Clear previous options

  const selectedCriteria = filterCriteria.value;
  if (selectedCriteria) {
    const uniqueValues = Array.from(
      new Set(jobData.map((job) => job[selectedCriteria]))
    );
    uniqueValues.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      filterOptions.appendChild(option);
    });
  }
}

// Filter jobs based on selected criteria and option
document.getElementById("filterOptions").addEventListener("change", function () {
  const selectedCriteria = document.getElementById("filterCriteria").value;
  const selectedOption = this.value;

  const filteredJobs = jobData.filter(
    (job) => job[selectedCriteria] === selectedOption
  );
  displayJobs(filteredJobs);
});

// Sort jobs by title
document.getElementById("sortTitle").addEventListener("click", function () {
  const sortedJobs = [...jobData].sort((a, b) =>
    a.Title.localeCompare(b.Title)
  );
  displayJobs(sortedJobs);
});

// Sort jobs by posted time
document.getElementById("sortPosted").addEventListener("click", function () {
  const sortedJobs = [...jobData].sort((a, b) => {
    const timeA = parsePostedTime(a.Posted);
    const timeB = parsePostedTime(b.Posted);
    return timeA - timeB;
  });
  displayJobs(sortedJobs);
});

// Parse "Posted" time to minutes
function parsePostedTime(postedTime) {
  const [value, unit] = postedTime.split(" ");
  const minutes = {
    minute: 1,
    minutes: 1,
    hour: 60,
    hours: 60,
    day: 1440,
    days: 1440,
  };
  return parseInt(value) * (minutes[unit] || 0);
}

// Update filter options when criteria changes
document.getElementById("filterCriteria").addEventListener("change", populateFilterOptions);
