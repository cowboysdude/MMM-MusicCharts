/* Magic Mirror
 * Module: MMM-Chart
 *
 * By cowboysdude
 *
 */
Module.register("MMM-MusicCharts", {

    // Module config defaults.
    defaults: {
        updateInterval: 60 * 1000, // every 10 minutes
        animationSpeed: 10,
        initialLoadDelay: 875, // 0 seconds delay
        retryDelay: 1500,
        maxWidth: "400px",
        fadeSpeed: 7,
        chart: 'Please select a chart from Readme',
        rotateInterval: 10 * 1000
    },

    getStyles: function() {
        return ["MMM-MusicCharts.css"];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);

        // Set locale.
        this.url = "http://www.billboard.com/rss/charts/hot-100";
        this.today = "";
        this.chart = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },


    getDom: function() {

        var chart = this.chart;

        var wrapper = document.createElement("div");
        //wrapper.className = "post-container";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.classList.add("wrapper");
            wrapper.innerHTML = "Calculating your requested chart ...<img src='modules/MMM-MusicCharts/icons/eq.gif' width=28px; height=28px;>";
            wrapper.className = "bright small";
            return wrapper;
        }

        var keys = Object.keys(this.chart);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            var chart = this.chart[keys[this.activeItem]];



            var rank = document.createElement("div");
            rank.classList.add("xlarge", "bright", "left");
            rank.innerHTML = chart.rank;
            wrapper.appendChild(rank);

            var top = document.createElement("div");

            var artistLogo = document.createElement("p");
            var artistIcon = document.createElement("img");
            if ("http://" + chart.cover != 'http://undefined') {
                artistIcon.classList.add("photo", "left");
                artistIcon.src = "http://" + chart.cover;
            } else {
                artistIcon.classList.add("nophoto", "left");
                artistIcon.src = "modules/MMM-MusicCharts/icons/note.jpg";
            }
            artistLogo.appendChild(artistIcon);
            top.appendChild(artistLogo);

            var title = document.createElement("p");
            title.classList.add("xsmall", "bright", "list-title");
            title.innerHTML = "TITLE: " + chart.title;
            top.appendChild(title);

            var artist = document.createElement("p");
            artist.classList.add("xsmall", "bright", "list-title");
            artist.innerHTML = "ARTIST: " + chart.artist;
            top.appendChild(artist);

            var lastrank = document.createElement("p");
            lastrank.classList.add("xsmall", "bright", "list-title");
            lastrank.innerHTML = "Last Week Rank: #" + chart.position['Last Week'];
            top.appendChild(lastrank);

            var peak = document.createElement("p");
            peak.classList.add("xsmall", "bright", "list-title");
            peak.innerHTML = "Highest spot on chart: #" + chart.position['Peak Position'];
            top.appendChild(peak);

            var weeksOn = document.createElement("p");
            weeksOn.classList.add("xsmall", "bright", "list-title");
            weeksOn.innerHTML = "Weeks on chart: " + chart.position['Wks on Chart'];
            top.appendChild(weeksOn);

            wrapper.appendChild(top);

        }
        return wrapper;

    },

    processChart: function(data) {
        this.today = data.Today;
        this.chart = data;
        console.log(this.chart);
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Scheduling music Chart...");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getChart();
        }, this.config.updateInterval);
        this.getChart(this.config.initialLoadDelay);
    },

    getChart: function() {
        this.sendSocketNotification('GET_CHART');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CHART_RESULT") {
            this.processChart(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },

});
