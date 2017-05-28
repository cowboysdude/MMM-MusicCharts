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
        fadeSpeed: 7,
        chart: 'hot-100',
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
		wrapper.classList.add("main");
        

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
            var chart = this.chart[keys[this.activeItem]];
            
            var rank = document.createElement("div");
            var lastWeek = chart.position['Last Week'];
            rank.classList.add("xlarge", "bright", "first-div");
            if (chart.rank === lastWeek ||lastWeek === '--'){
			rank.innerHTML = "<img src= 'modules/MMM-MusicCharts/icons/spacer.png'>"+ chart.rank;	
			} else if(chart.rank < lastWeek){
			rank.innerHTML = "<img src= 'modules/MMM-MusicCharts/icons/up1.png'>"+ chart.rank;	
			} else {
			rank.innerHTML = "<img src= 'modules/MMM-MusicCharts/icons/down1.png'>"+ chart.rank;	
			}
            wrapper.appendChild(rank);

            var artistLogo = document.createElement("div");
            var artistIcon = document.createElement("img");
            if ("http://" + chart.cover !== 'http://undefined') {
                artistIcon.classList.add("photo", "second-div");
                artistIcon.src = "http://" + chart.cover;
            } else {
                artistIcon.classList.add("photo", "second-div");
                artistIcon.src = "modules/MMM-MusicCharts/icons/note.jpg";
            }
            artistLogo.appendChild(artistIcon);
            wrapper.appendChild(artistLogo);

            var thirdDiv = document.createElement("div");
                        
            
            var title = document.createElement("span");
            title.classList.add("xsmall", "bright", "span");
            if (chart.artist != undefined){
            title.innerHTML = "TITLE: " + chart.title;
				} else {
			title.innerHTML = "ARTIST: " + chart.title;		
				}	
            thirdDiv.appendChild(title);

            if (chart.artist != undefined){
            var artist = document.createElement("span");
            artist.classList.add("xsmall", "bright", "span");
			artist.innerHTML = "ARTIST: " + chart.artist;
            thirdDiv.appendChild(artist);
            }
            
            var lastrank = document.createElement("span");
            lastrank.classList.add("xsmall", "bright", "span");
            lastrank.innerHTML = "Last Week Rank: #" + chart.position['Last Week'];
            thirdDiv.appendChild(lastrank);

            var peak = document.createElement("span");
            peak.classList.add("xsmall", "bright", "span");
            peak.innerHTML = "Highest Rank: #" + chart.position['Peak Position'];
            thirdDiv.appendChild(peak);

            var weeksOn = document.createElement("span");
            weeksOn.classList.add("xsmall", "bright", "span");
            weeksOn.innerHTML = "Weeks on chart: " + chart.position['Wks on Chart'];
            thirdDiv.appendChild(weeksOn);
            
            wrapper.appendChild(thirdDiv);
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
