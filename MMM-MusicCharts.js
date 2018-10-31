/* Magic Mirror
 * Module: MMM-MusicCharts
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
        fadeSpeed: 7,
        rotateInterval: 10 * 1000,
		apiKey: ""
    },

    getStyles: function() {
        return ["MMM-MusicCharts.css"];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);

        // Set locale. 
        this.today = "";
        this.chart = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },


    getDom: function() {

        var chart = this.chart;

        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.classList.add("container");
            wrapper.innerHTML = "Calculating your requested chart ...<img src='modules/MMM-MusicCharts/icons/eq.gif' width=28px; height=28px;>";
            wrapper.className = "bright small";
            return wrapper;
        }

        var keys = Object.keys(this.chart);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            chart = this.chart[keys[this.activeItem]];
 
            var img = document.createElement("img");
            img.classList.add("photo");
            img.src = chart.cover;
            img.onerror = function(event_object) {
                var img_with_error = event_object.currentTarget
                img_with_error.src = "modules/MMM-MusicCharts/icons/note.jpg"
            }
            wrapper.appendChild(img);

            var title = document.createElement("span");
            title.classList.add("xsmall", "bright", "span");
            title.innerHTML = "TITLE: " + chart.track;
            wrapper.appendChild(title);

            var artist = document.createElement("span");
            artist.classList.add("xsmall", "bright", "span");
            artist.innerHTML = "ARTIST: " + chart.artist;
            wrapper.appendChild(artist);

            var weeksOn = document.createElement("span");
            weeksOn.classList.add("xsmall", "bright", "span");
            weeksOn.innerHTML = "RANK: " + chart.rank;
            wrapper.appendChild(weeksOn);

        }
        return wrapper;

    },

    processChart: function(data) {
        this.today = data;
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
        if (notification === "CHART_RESULTS") {
            this.processChart(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },

});