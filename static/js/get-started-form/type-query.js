function setProjectTypeFromQuery() {
    const queryParams = getQueryParams();
    if (queryParams.has("type")) {
        setProjectType(queryParams.get("type"));
    }
}

function setProjectType(value) {
    const projectTypeOption = document.querySelector(`#getStartedForm input[name="project[type]"][value="${value}"]`);
    if (null !== projectTypeOption) {
        projectTypeOption.checked = true;
    }
}

function getQueryParams() {
    return new URLSearchParams(window.location.search);
}

window.addEventListener("load", setProjectTypeFromQuery);