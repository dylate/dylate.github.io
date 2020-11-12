const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

nextBtn.addEventListener('click', handleNextClick);
prevBtn.addEventListener('click', handlePrevClick);

function handleNextClick(event) {
    event.preventDefault();
    if (currentStep < getLastStep()) {
        showNextStep();
    } else {
        // submitForm();
    }
}

function handlePrevClick(event) {
    event.preventDefault();
    if (currentStep > 0) {
        showPreviousStep();
    }
}

const getStartedForm = document.getElementById('getStartedForm');
const steps = getStartedForm.querySelectorAll('.step');

let currentStep = 0;

function showNextStep() {
    currentStep++;
    if (isValid) {
        showCurrentStep();
        updateProgressBar();
    }
}

function showPreviousStep() {
    currentStep--;
    showCurrentStep();
    updateProgressBar();
}

function showCurrentStep() {
    const numberOfSteps = steps.length;
    for (let index = 0; index < numberOfSteps; index++) {
        let step = steps.item(index);
        if (index === currentStep) {
            step.style.display = 'block';
        } else {
            step.style.display = 'none';
        }
    }
}

function getLastStep() {
    return steps.length - 1;
}

let isValid = false;

const progressBar = document.getElementById('progressBar');

function updateProgressBar() {
    const numberOfSteps = steps.length;
    progressBar.style.width = `${(currentStep / numberOfSteps) * 100}%`;
}

window.addEventListener('load', showCurrentStep);