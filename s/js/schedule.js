const fetchSchedule = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Vanthanyx/244CREW/refs/heads/main/s/json/temp-schedule.json"
    );
    const data = await response.json();

    const tableBody = document
      .getElementById("schedule-table")
      .getElementsByTagName("tbody")[0];

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const currentDayIndex = new Date().getDay() - 1; // Adjust to match your array index (Sunday = 0)
    const username = atob(sessionStorage.getItem("USER"));

    data.schedule.forEach((associate) => {
      const row = tableBody.insertRow();

      // Check if this row is the user's row
      if (associate.name === username) {
        row.classList.add("user-row");
      }

      const cell = row.insertCell(0);
      cell.innerHTML = `${associate.associate_level}&nbsp;${associate.name}`;

      days.forEach((day, index) => {
        const shiftTime = associate.shifts[day];
        const cell = row.insertCell();
        cell.textContent = shiftTime;
        cell.classList.add("cell-tooltip");
        if (cell.textContent === "RO") {
          cell.setAttribute("data-tooltip", `Requested Off`);
        } else if (cell.textContent === "") {
          cell.setAttribute("data-tooltip", `Associate Not Scheduled`);
        } else {
          cell.setAttribute("data-tooltip", `${associate.name}: ${shiftTime}`);
        }
        // Highlight today's column
        if (index === currentDayIndex) {
          cell.classList.add("highlight");
        }
      });
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
  }
};

fetchSchedule();

function getUserShifts() {
  const username = atob(sessionStorage.getItem("USER"));
  const table = document.getElementById("schedule-table");
  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");

    if (cells.length > 0 && cells[0].textContent.includes(username)) {
      const userShifts = Array.from(cells)
        .slice(1)
        .map((cell) => cell.textContent);

      sessionStorage.setItem("USER_SHIFTS", JSON.stringify(userShifts)); // Store shifts
      return userShifts;
    }
  }
  return [];
}

function saturdayMeeting() {
  const saturdayCell = document.getElementById("sat"); // Saturday is the 7th day, index 6
  if (saturdayCell) {
    saturdayCell.classList.add("pulse-red");
    saturdayCell.innerHTML = "Saturday<br>[Mandatory Meeting]";
  }
}
//saturdayMeeting();
