class GetStartedForm {
    constructor() {
        this.element = document.getElementById("getStartedForm");
        this.steps = [
            new ProjectTypeStep(),
            new NameStep(),
            new RequiredTextStep(3, 'email'),
            new RequiredTextStep(4, 'phone'),
            new CompanyWebsiteStep(),
            new RequiredTextStep(6, 'companyName'),
            new RequiredTextStep(7, 'companyDescription'),
            new RequiredTextStep(8, 'projectDescription'),
        ];
        this.progressBar = new ProgressBar('#progressBar');
        this.nextBtn = new FormButton('#nextBtn', this.handleNextBtnClick.bind(this));
        this.prevBtn = new FormButton('#prevBtn', this.handlePrevBtnClick.bind(this));
        this.loader = new FormLoader('#getStartedForm .loader');
        this.currentStepIndex = 0;
        window.addEventListener('load', this.showCurrentStep.bind(this));
    }

    handleNextBtnClick(event) {
        event.preventDefault();
        this.getCurrentStep().validate();
        if (this.currentStepIndex < this.getLastStepIndex()) {
            this.showNextStep();
        } else {
            this.submit();
        }
    }

    handlePrevBtnClick(event) {
        event.preventDefault();
        if (this.currentStepIndex > 0) {
            this.showPreviousStep();
        }
    }

    submit() {
        this.loader.show();
        let formData = new FormData(this.element);
        let jsonData = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            company: {
                website: formData.get("company[website]"),
                name: formData.get("company[name]"),
                description: formData.get("company[description]")
            },
            project: {
                type: formData.get("project[type]"),
                description: formData.get("project[description]")
            }
        };
        Dylate.createLead(jsonData)
            .then(() => {
                this.showSuccessMessage('Your project was successfully submitted, we will be reaching out to you soon!');
            }).catch((error) => {
                console.log(error);
                this.showErrorMessage('We had an error submitting your project. Please email us at info@dylate.net.');
            }).finally(() => this.loader.hide());
    }

    showNextStep() {
        let currentStep = this.getCurrentStep();
        if (currentStep.isValid) {
            this.currentStepIndex++;
            this.showCurrentStep();
            this.updateProgressBar();
        }
    }

    showPreviousStep() {
        this.currentStepIndex--;
        this.showCurrentStep();
        this.updateProgressBar();
    }

    updateProgressBar() {
        let decimal = this.currentStepIndex / this.steps.length;
        let percentage = decimal * 100;
        this.progressBar.setProgress(percentage);
    }

    showCurrentStep() {
        const numberOfSteps = this.steps.length;
        for (let index = 0; index < numberOfSteps; index++) {
            let step = this.steps[index];
            if (index === this.currentStepIndex) {
                step.show();
            } else {
                step.hide();
            }
        }
    }

    getCurrentStep() {
        return this.steps[this.currentStepIndex];
    }

    getLastStepIndex() {
        return this.steps.length - 1;
    }

    showSuccessMessage(message) {
        $('#successModal .modal-body').text(message);
        $('#successModal').modal('show');
    }

    showErrorMessage(message) {
        $('#errorModal .modal-body').text(message);
        $('#errorModal').modal('show');
    }
}

class Step {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.isValid = false;
    }

    validate() {
        this.isValid = true;
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    showInvalidFeedback(invalidFeedbackElementId) {
        let invalidFeedbackElement = document.getElementById(invalidFeedbackElementId);
        invalidFeedbackElement.style.display = 'block';
    }

    hideInvalidFeedback(invalidFeedbackElementId) {
        let invalidFeedbackElement = document.getElementById(invalidFeedbackElementId);
        invalidFeedbackElement.style.display = 'none';
    }
}

class ProjectTypeStep extends Step {
    constructor() {
        super('#getStartedForm .step:nth-child(1)');
        this.options = this.element.querySelectorAll('input[name="project[type]"]');
    }

    validate() {
        if (this.checkForSelection()) {
            this.isValid = true;
            this.unsetErrorMessage();
        } else {
            this.isValid = false;
            this.setErrorMessage();
        }
    }

    checkForSelection() {
        let numberOfOptions = this.options.length;
        for (let index = 0; index < numberOfOptions; index++) {
            let option = this.options.item(index);
            if (option.checked) {
                return true;
            }
        }
        return false;
    }

    setErrorMessage() {
        let cards = this.element.querySelectorAll('.list-group .card');
        cards.forEach(card => {
            card.classList.add('border-danger');
            card.classList.add('text-danger');
        });
        this.showInvalidFeedback('projectTypeInvalidFeedback');
    }

    unsetErrorMessage() {
        let cards = this.element.querySelectorAll('.list-group .card');
        cards.forEach(card => {
            card.classList.remove('border-danger');
            card.classList.remove('text-danger');
        });
        this.hideInvalidFeedback('projectTypeInvalidFeedback');
    }
}

class NameStep extends Step {
    constructor() {
        super('#getStartedForm .step:nth-child(2)');
        this.firstNameElement = document.getElementById('firstName');
        this.lastNameElement = document.getElementById('lastName');
    }

    validate() {
        if (this.checkFirstName() && this.checkLastName()) {
            this.isValid = true;
        } else {
            this.isValid = false;
        }
    }

    checkFirstName() {
        if (this.firstNameElement.value) {
            this.unsetFirstNameErrorMessage();
            return true;
        } else {
            this.setFirstNameErrorMessage();
            return false;
        }
    }

    checkLastName() {
        if (this.lastNameElement.value) {
            this.unsetLastNameErrorMessage();
            return true;
        } else {
            this.setLastNameErrorMessage();
            return false;
        }
    }

    setFirstNameErrorMessage() {
        this.firstNameElement.classList.add('is-invalid');
    }

    unsetFirstNameErrorMessage() {
        this.firstNameElement.classList.remove('is-invalid');
    }

    setLastNameErrorMessage() {
        this.lastNameElement.classList.add('is-invalid');
    }

    unsetLastNameErrorMessage() {
        this.lastNameElement.classList.remove('is-invalid');
    }
}

class RequiredTextStep extends Step {
    constructor(stepNumber, fieldId) {
        super(`#getStartedForm .step:nth-child(${stepNumber})`);
        this.fieldElement = document.getElementById(fieldId);
    }

    validate() {
        if (this.fieldElement.value) {
            this.unsetErrorMessage();
            this.isValid = true;
        } else {
            this.setErrorMessage();
            this.isValid = false;
        }
    }

    setErrorMessage() {
        this.fieldElement.classList.add('is-invalid');
    }

    unsetErrorMessage() {
        this.fieldElement.classList.remove('is-invalid');
    }
}

class CompanyWebsiteStep extends RequiredTextStep {
    constructor() {
        super(5, 'companyWebsite');
        this.fieldElementContainer = document.getElementById('companyWebsiteFieldContainer');
        this.hasWebsiteField = document.getElementById('companyHasWebsite');
        this.hasWebsiteField.addEventListener('change', this.toggleWebsiteContainer.bind(this));
    }

    /** Override */
    validate() {
        if (this.checkIsWebsiteContainerHidden()) {
            this.isValid = true;
        } else if (this.fieldElement.value) {
            this.unsetErrorMessage();
            this.isValid = true;
        } else {
            this.setErrorMessage();
            this.isValid = false;
        }
    }

    toggleWebsiteContainer(event) {
        const selectElement = event.target;
        const selectedIndex = selectElement.selectedIndex;
        if (selectedIndex === 0) {
            this.fieldElement.value = "";
            this.fieldElementContainer.style.display = 'none';
        } else {
            this.fieldElementContainer.style.display = 'block';
        }
    }

    checkIsWebsiteContainerHidden() {
        return this.fieldElementContainer.style.display === 'none';
    }
}

class FormButton {
    constructor(selector, clickHandler) {
        this.element = document.querySelector(selector);
        this.element.addEventListener('click', clickHandler);
    }
}

class ProgressBar {
    constructor(selector) {
        this.element = document.querySelector(selector);
    }

    setProgress(value) {
        this.element.style.width = `${value}%`;
    }
}

class FormLoader {
    constructor(selector) {
        this.element = document.querySelector(selector);
    }

    show() {
        this.element.style.display = 'flex';
    }

    hide() {
        this.element.style.display = 'none';
    }
}

let getStartedForm = new GetStartedForm();

window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has("type")) {
        let presetType = urlParams.get("type");
        let projectTypeOption = document.querySelector(`#getStartedForm .step input[type=radio][name="project[type]"][value=${presetType}]`);
        if (projectTypeOption) {
            projectTypeOption.checked = true;
        }
    }
});