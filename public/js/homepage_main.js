// FRONT-END (CLIENT) JAVASCRIPT HERE

class hourEntry {
  constructor(date, num, reasoning) {
    this.date = date;
    this.numHours = num;
    this.reason = reasoning;
  }
  setDate(date) {
    this.date = date;
  }
  setNumHours(num) {
    this.numHours = num;
  }

  setReason(reason) {
    this.reason = reason;
  }

  setValid(isValid) {
    this.valid = isValid;
  }
}

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  let error_message = "";
  let dateBox = document.getElementById("date-of-hours");
  let numHoursBox = document.getElementById("number-of-hours");
  let reasoningBox = document.getElementById("reasoning-box");

  let error = document.getElementById("error-message");

  let dateVal = dateBox.value;
  let numHours = parseFloat(numHoursBox.value);
  let reasoning = reasoningBox.value;

  if (dateVal == "" || numHoursBox.value == "") {
    error_message = "Please fill out the fields";
  } else if (numHours < 0) {
    error_message = "Please enter a greater than zero number of hours";
  } else if (reasoning == "") {
    error_message = "Please give a reason for your hours";
  }
  console.log(error_message);

  if (error_message !== "") {
    error.style.opacity = 1;
    error.textContent = error_message;
    return;
  }
  error.style.opacity = 0;
  newSubmission = new hourEntry(dateVal, numHours, reasoning);
  console.log(newSubmission);
  const json = { mode: "add", entry: newSubmission };
  const body = JSON.stringify(json);
  serverResponse(body);
};

const serverResponse = async function (body) {
  const response = fetch("/submit", {
    method: "POST",
    body: body,
  });

  const text = await response.text();
  let data = JSON.parse(text);
  console.log("data:", data);
  writeInfoToScreen(data.entries);
};

//Front end for page one
window.onload = function () {
  const button = document.querySelector("#submit-button");
  button.onclick = submit;
  let error = document.getElementById("error-message");
  error.style.opacity = 0;

  const json = { mode: "read" };
  const body = JSON.stringify(json);

  (async function () {
    await serverResponse(body);
  })();
};

/*
html outline for the hour entry to shove into the grid


<div class="hourEntry">
  <div class="info">
    <p class="date">Date: 100</p>
    <p class="Reason">Protein: 10</p>
    <p class="hoursLeft">Hours Left: </p>
  </div>
  <div class ="delete">
    <a class="delete_x">x</a>
  </div>
</div>
*/
const writeInfoToScreen = function (submissions) {
  let entriesList = document.getElementById("listOfEntries");

  entriesList.innerHTML = "";
  let hoursSum = 7;

  for (i = 0; i < submissions.length; i++) {
    let entry = submissions[i];
    let entryHTML = document.createElement("div");
    entryHTML.classList.add("entry");

    let info = document.createElement("div");
    info.classList.add("info");

    let dateHTML = document.createElement("p");
    dateHTML.textContent = "Date: " + entry.data;
    dateHTML.classList.add("calories");
    info.appendChild(dateHTML);

    let reasonHTML = document.createElement("p");
    reasonHTML.textContent = "Reason: " + entry.reason;
    reasonHTML.classList.add("reason");
    info.appendChild(reasonHTML);

    let hoursLeftHTML = document.createElement("p");
    hoursLeftHTML.textContent =
      "Hours Left After This: " + (hoursSum - entry.numHours) + " hours";
    hoursSum -= entry.numHours;
    hoursLeftHTML.classList.add("hoursLeft");
    info.appendChild(hoursLeftHTML);

    entryHTML.appendChild(info);

    let deleteHTML = document.createElement("div");
    deleteHTML.style.height = "40px";
    deleteHTML.classList.add("delete");
    deleteHTML.onclick = async function () {
      const json = { mode: "delete", id: entry.id };
      const body = JSON.stringify(json);
      await serverResponse(body);
    };

    let deletButton = document.createElement("a");
    deletButton.textContent = "x";
    deletButton.classList.add("delete_x");
    deleteHTML.appendChild(deletButton);

    entryHTML.appendChild(deleteHTML);

    entriesList.appendChild(entryHTML);
  }
};