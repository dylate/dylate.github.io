class LatestNews {
    constructor() {
        this.rowElement = document.getElementById("latestNewsList");
        this.getHtml = this.getHtml.bind(this);
        this.setRowHtml = this.setRowHtml.bind(this);
        this.setRowError = this.setRowError.bind(this);
    }

    addFeedElementsToRow() {
        SoftwareFeed.getJson(3)
            .then(this.getHtml)
            .then(this.setRowHtml)
            .catch(this.setRowError);
    }

    getHtml(articles) {
        console.log(articles);
        let html = ``;
        for (const article of articles) {
            html += `
            <div class="col-md-4 m-15px-tb">
                <div class="blog-item">
                    <div class="blog-img">
                        <a href="${article.link}">
                            <img src="${article.thumbnail}" title="" alt="">
                        </a>
                    </div>
                    <div class="blog-content">
                        <div class="post-meta"> ${article.author} </div><!-- /post-meta -->
                        <h4><a class="dark-color" href="#">${article.title}</a></h4>
                        <p>${article.description.replace(/(<([^>]+)>)/gi, "")}</p>
                        <div class="btn-bar">
                            <a class="btn btn-theme" href="${article.link}">Read More</a>
                        </div>
                    </div><!-- /blog-content -->
                </div>
            </div>`;
        }
        return Promise.resolve(html);
    }

    setRowHtml(html) {
        this.rowElement.innerHTML = html;
    }

    setRowError(error) {
        console.log(error);
        this.setRowHtml(`
            <p>There was an error loading the articles</p>
        `);
    }
}

window.addEventListener("load", () => {
    const latestNews = new LatestNews();
    latestNews.addFeedElementsToRow();
});