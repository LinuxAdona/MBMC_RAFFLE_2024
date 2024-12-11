let group = 0;
let history = [];
let people = {};

function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log("Parsed Excel Data:", jsonData);
            processExcelData(jsonData);
        };

        reader.readAsBinaryString(file);
    } else {
        alert("Please select a file.");
    }
}

function processExcelData(data) {
    people = {};

    for (let i = 0; i < data.length; i++) {
        const groupNumber = data[i][0];
        const name = data[i][1];

        if (groupNumber && name) {
            if (!people[groupNumber]) {
                people[groupNumber] = [];
            }

            people[groupNumber].push(name);
        }
    }

    console.log("Groups of People:", people);

    document.querySelectorAll(".group-btn").forEach(button => {
        button.disabled = false;
    });

    alert("Data loaded successfully!");
}

function setGroup(selectedGroup) {
    if (!people[selectedGroup] || people[selectedGroup].length === 0) {
        alert("Data is empty or not available!");
        return;
    }

    group = selectedGroup;
    document.getElementById("rollingMessage").textContent = `Ready to roll!`;
    document.getElementById("winner").textContent = "None yet";
}

function roll() {
    if (group === 0) {
        alert("Error! Please import data first!");
        return;
    }

    const allPeople = Object.values(people).flat();
    const groupPeople = people[group].filter(person => !history.includes(person));

    let currentIndex = 0;
    const interval = setInterval(() => {
        document.getElementById("rollingMessage").textContent = `${allPeople[currentIndex]}`;
        currentIndex = (currentIndex + 1) % allPeople.length;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const winner = groupPeople[Math.floor(Math.random() * groupPeople.length)];
        document.getElementById("winner").textContent = winner;
        document.getElementById("rollingMessage").textContent = `Winner: ${winner}`;

        history.push(winner);
        updateHistory();
    }, 3000);
}

function updateHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    history.forEach(winner => {
        const listItem = document.createElement("li");
        listItem.textContent = winner;
        historyList.appendChild(listItem);
    });
}

function toggleHistory() {
    const historyListContainer = document.getElementById("historyListContainer");
    const isVisible = historyListContainer.style.display === 'block';
    historyListContainer.style.display = isVisible ? 'none' : 'block';
    document.getElementById("toggleHistoryBtn").textContent = isVisible ? 'Show History' : 'Hide History';
}

document.addEventListener("keydown", function (event) {
    if (event.key === "1") setGroup(1);
    else if (event.key === "2") setGroup(2);
    else if (event.key === "3") setGroup(3);
    else if (event.key === "4") setGroup(4);
});