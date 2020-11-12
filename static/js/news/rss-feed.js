class SoftwareFeed {
    static feedUrl = "https://medium.com/feed/topic/software-engineering";

    static getJson(count) {
        const jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${SoftwareFeed.feedUrl}`;
        return fetch(jsonUrl)
            .then((response) => response.json())
            .then((json) => json.items.slice(0, count));
    }
}