class Dylate {
    static baseUrl = "https://api.dylate.net";

    static createLead(data) {
        return fetch(Dylate.baseUrl + "/leads", {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        }).then(res => res.json());
    }
}