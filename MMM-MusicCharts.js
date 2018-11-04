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
        
		    var Logoimg = document.createElement("img"); 
			Logoimg.classList.add("imgLogo");
            Logoimg.src = 'modules/MMM-MusicCharts/icons/test2.png'; 
            wrapper.appendChild(Logoimg);
			
		   var nextDiv = document.createElement("div");
		   nextDiv.classList.add("flexcontainer");
           wrapper.appendChild(nextDiv);		
		
		var keys = Object.keys(this.chart);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            chart = this.chart[keys[this.activeItem]];

            var weeksOn = document.createElement("div");
            weeksOn.classList.add("columns", "fonty");
            weeksOn.innerHTML = chart.rank;
            nextDiv.appendChild(weeksOn);
			wrapper.appendChild(nextDiv); 
 
            var img = document.createElement("img"); 
			img.classList.add("columns","img");
            img.src = chart.cover;
            img.onerror = function(event_object) {
                var img_with_error = event_object.currentTarget
                img_with_error.src = "modules/MMM-MusicCharts/icons/note.jpg"
            }
            nextDiv.appendChild(img);
			wrapper.appendChild(nextDiv);

            var title = document.createElement("div");
            title.classList.add("fontLetter","columns", "bright");
            title.innerHTML = "TITLE: " + chart.track + "<BR>ARTIST: " + chart.artist + "<BR>PLAY COUNT: " + chart.played;
            nextDiv.appendChild(title);
			wrapper.appendChild(nextDiv);
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