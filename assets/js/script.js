/** 
Author:    Build Rise Shine with Nyros (BRS) 
Created:   2023
Library / Component: Script file
Description: Rock Paper Scissor game logic
(c) Copyright by BRS with Nyros. 
**/

// Initialize priority list, assigned to list, and stories array
const priorityList = ["Low", "Medium", "High"];
const assignedToList = ["Edwin", "Tom", "Carl", "Jerome", "Carmelo"];
let storyList = [];

// Default theme
const defaultTheme = "#1A4B84";

// Elements
const description = document.getElementById("description");
const assignedTo = document.getElementById("assignedto");
const priority = document.getElementById("priority");
const storySubmitBtn = document.getElementById("storySubmitBtn");
const storyCardList = document.getElementById("storyCardList");
const descriptionLength = document.getElementById("descLength");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const maxLength = 100;
const warnLength = 90;

// Event Listeners
["keyup", "change", "keydown", "focus"].forEach(function(eventName) {
  description.addEventListener(eventName, textCounter);
});

["cut", "copy", "paste"].forEach(function(eventName) {
  description.addEventListener(eventName, preventCCP);
});

// Prevent cut, copy, paste
function preventCCP(event) {
  event.preventDefault();
  alert("No cut, copy, paste allowed");
  return false;
}

// Close story
const closeStory = storyId => {
  storyList.forEach(story => {
    if (story.id === storyId) {
      story.storyStatus = "closed";
    }
  });
  updateList();
};

// Delete story
const deleteStory = storyId => {
  storyList = storyList.filter(story => story.id !== storyId);
  updateList();
};

// Update the store (local storage)
const updateStore = () => {
  localStorage.setItem("storyList", JSON.stringify(storyList));
};

// Define formatDate function
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const suffix = getDaySuffix(day);
  return `${day}${suffix} ${month}, ${year}`;
}

// Define getDaySuffix function
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Update the story list
const updateList = () => {
  if (storyList.length > 0) {
    let storyListHTML = "<div><h2 class=display-6 pb-2>Story List</h2></div>";
    storyList.forEach(issue => {
      storyListHTML += `
        <div id="${issue.id}" class="col-4">
          <div class="p-3">
            <div class="card" >
              <div class="card-header">Priority: ${
                priorityList[issue.priority]
              } 
                <span class="mx-4 ${
                  issue.storyStatus === "open"
                    ? "badge bg-primary"
                    : "badge bg-danger"
                }"> 
                  ${issue.storyStatus === "open" ? "open" : "closed"}</span>
              </div>
              <div class="card-body">
                <p class="text-start pb-1">Assigned to : ${
                  assignedToList[issue.assignedTo]
                }</p>

                <p class="text-start pb-1">From Date: ${formatDate(
                  issue.fromDate
                )}</p>
                <p class="text-start pb-1">To Date: ${formatDate(
                  issue.toDate
                )}</p>
                <p class="card-text text-start">${issue.description}</p>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  ${
                    issue.storyStatus === "closed"
                      ? ""
                      : ` <button type="button" onclick="closeStory('${issue.id}')" class="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Close story">Close</button>`
                  }
                  <button type="button" onclick="deleteStory('${
                    issue.id
                  }')" class="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete story">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    });
    storyCardList.innerHTML = storyListHTML;
  } else {
    storyCardList.innerHTML = `<div>
                                  <h2 class="display-6 pb-2">Story List</h2>
                                  <p p-5>No story to display</p>
                               </div>`;
  }
  updateStore();
};

// Initialize the app
const initApp = () => {
  const storedList = JSON.parse(localStorage.getItem("storyList")) || [];
  storyList = [...storedList];
  updateList();
};
initApp();

// Form validation
const formValidate = event => {
  event.preventDefault();

  if (description.value === "") {
    alert("Please enter description");
    description.focus();
    return;
  }
  if (description.value.trim().length < 60) {
    alert("Description should be at least 60 characters");
    description.focus();
    return;
  }
  if (assignedTo.value === "") {
    alert("Please select assigned to");
    assignedTo.focus();
    return;
  }
  if (fromDate.value === "") {
    alert("Please select fromDate");
    fromDate.focus();
    return;
  }
  if (toDate.value === "") {
    alert("Please select toDate");
    toDate.focus();
    return;
  }
  if (priority.value === "") {
    alert("Please select priority");
    priority.focus();
    return;
  }

  const newStory = {
    id:
      "id" +
      Math.random()
        .toString(16)
        .slice(2), // Generate id
    description: description.value,
    assignedTo: assignedTo.value,
    priority: priority.value,
    fromDate: fromDate.value, // Corrected key name
    toDate: toDate.value, // Corrected key name
    storyStatus: "open"
  };

  storyList.push(newStory);

  // Reset form fields
  description.value = "";
  assignedTo.value = "";
  priority.value = "";
  fromDate.value = "";
  toDate.value = "";
  descriptionLength.innerHTML = "";

  updateList();
};

function textCounter() {
  let count = description.value.length;
  descriptionLength.innerHTML = `${maxLength - count} characters left`;
  descriptionLength.classList.remove("text-danger");

  if (count === 0) {
    descriptionLength.innerHTML = `${maxLength} characters left`;
  }

  if (count > maxLength) {
    description.value = description.value.substring(0, maxLength);
    count = maxLength;
  }

  if (count > warnLength) {
    descriptionLength.classList.add("text-danger");
    descriptionLength.innerHTML = `${maxLength - count} characters left`;
  }
}

storySubmitBtn.addEventListener("click", formValidate);

// Change Theme
function setTheme(theme) {
  document.documentElement.style.setProperty("--primary-color", theme);
  localStorage.setItem("movie-theme", theme);
}
setTheme(localStorage.getItem("movie-theme") || defaultTheme);
