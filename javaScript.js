let subjectIdCounter = 0;

window.onload = () => {
    const savedData = localStorage.getItem("markMasterData");
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Load student details
        document.getElementById("studentName").value = data.studentName || "";
        document.getElementById("studentStd").value = data.std || "";
        document.getElementById("studentSec").value = data.sec || "";

        if (data.subjects && data.subjects.length > 0) {
            data.subjects.forEach(sub => {
                addSubject(sub.name, sub.mark);
            });
        } else {
            loadDefaultSubjects();
        }
        
        updateResultsUI(data);
    } else {
        loadDefaultSubjects();
    }
};

const loadDefaultSubjects = () => {
    addSubject();
    addSubject();
    addSubject();
};

const addSubject = (savedName = "", savedMark = "") => {
    subjectIdCounter++;
    const container = document.getElementById("subjectsContainer");
    
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 subject-item";
    col.id = `subjectRow-${subjectIdCounter}`;
    
    col.innerHTML = `
        <div class="card h-100 border border-secondary border-2 rounded-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <input type="text" class="form-control fw-bold border-0 bg-light me-2 subject-name" placeholder="Subject Name" value="${savedName}" required>
                    <button type="button" class="btn-close" aria-label="Remove" onclick="removeSubject(${subjectIdCounter})"></button>
                </div>
                <label class="form-label text-secondary small">Marks out of 100</label>
                <input type="number" class="form-control form-control-lg rounded-3 border-secondary mark-input" min="0" max="100" value="${savedMark}" required>
            </div>
        </div>
    `;
    
    container.appendChild(col);
}

const removeSubject = (id) => {
    const element = document.getElementById(`subjectRow-${id}`);
    if (element) {
        element.remove();
    }
}

const finalMark = () => {
    const studentName = document.getElementById("studentName").value.trim();
    const studentStd = document.getElementById("studentStd").value.trim();
    const studentSec = document.getElementById("studentSec").value.trim();
    
    const subjectRows = document.querySelectorAll('.subject-item');
    const errorAlert = document.getElementById("errorAlert");

    // Form validation
    if (!studentName || !studentStd || !studentSec || subjectRows.length === 0) {
        errorAlert.style.display = "block";
        setTimeout(() => { errorAlert.style.display = "none"; }, 5000);
        return;
    }

    let total = 0;
    let isValid = true;
    const subjectsData = [];

    subjectRows.forEach(row => {
        const nameInput = row.querySelector('.subject-name').value.trim();
        const markInput = row.querySelector('.mark-input').value;
        const numVal = Number(markInput);
        
        if (nameInput === "" || markInput === "" || numVal < 0 || numVal > 100) {
            isValid = false;
        } else {
            total += numVal;
            subjectsData.push({ name: nameInput, mark: markInput });
        }
    });

    if (!isValid) {
        errorAlert.style.display = "block";
        setTimeout(() => { errorAlert.style.display = "none"; }, 5000);
        return; 
    }

    const numSubjects = subjectsData.length;
    const maxTotalMarks = numSubjects * 100;
    const average = Number((total / numSubjects).toFixed(2));

    let grade = "Fail";
    if (average >= 85) grade = "A";
    else if (average >= 75) grade = "B";
    else if (average >= 65) grade = "C";
    else if (average >= 50) grade = "D";
    
    const resultData = {
        studentName: studentName,
        std: studentStd,
        sec: studentSec,
        subjects: subjectsData,
        total: total,
        maxTotal: maxTotalMarks,
        average: average,
        grade: grade
    };
    
    localStorage.setItem("markMasterData", JSON.stringify(resultData));
    updateResultsUI(resultData);
}

const updateResultsUI = (data) => {
    document.getElementById("totalMarks").innerText = data.total;
    document.getElementById("totalMaxText").innerText = `out of ${data.maxTotal}`;
    document.getElementById("averageMark").innerText = data.average + "%";
    document.getElementById("finalGrade").innerText = data.grade;
    
    document.getElementById("resultStudentInfo").innerHTML = 
        `Report for <strong>${data.studentName}</strong> (Std: ${data.std}, Sec: ${data.sec})`;
}

const resetBtn = () => {
    localStorage.removeItem("markMasterData");

    document.getElementById("studentName").value = "";
    document.getElementById("studentStd").value = "";
    document.getElementById("studentSec").value = "";

    document.getElementById("totalMarks").innerText = "0";
    document.getElementById("totalMaxText").innerText = "out of 0";
    document.getElementById("averageMark").innerText = "0%";
    document.getElementById("finalGrade").innerText = "—";
    document.getElementById("resultStudentInfo").innerText = "Based on your entered marks";
    
    document.getElementById("errorAlert").style.display = "none";

    document.getElementById("subjectsContainer").innerHTML = "";
    loadDefaultSubjects();
}