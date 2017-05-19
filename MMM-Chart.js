/* Magic Mirror
  * Module: MMM-Chart
  *
  * By cowboysdude
  * 
  */
 Module.register("MMM-Chart", {

     // Module config defaults.
     defaults: {
         updateInterval: 60 * 1000, // every 10 minutes
         animationSpeed: 10,
         initialLoadDelay: 875, // 0 seconds delay
         retryDelay: 1500,
         maxWidth: "400px",
         fadeSpeed: 7,
         chart: 'Please select a chart from Readme',
         rotateInterval: 5 * 1000
     },

     getStyles: function() {
         return ["MMM-Chart.css"];
     },

     // Define start sequence.
     start: function() {
         Log.info("Starting module: " + this.name);
         this.sendSocketNotification('CONFIG', this.config);

         // Set locale.
         this.url = "http://www.billboard.com/rss/charts/hot-100";
         this.today = "";
         //this.chart = {};
         this.activeItem = 0;
         this.rotateInterval = null;
         this.scheduleUpdate();
     },


     getDom: function() {

         var chart = this.chart;

         var wrapper = document.createElement("div");
         wrapper.className = "wrapper";
         wrapper.style.maxWidth = this.config.maxWidth;

         if (!this.loaded) {
             wrapper.classList.add("wrapper");
             wrapper.innerHTML = "Calculating Top 100 chart ...";
             wrapper.className = "bright light small";
             return wrapper;
         }
         
         var keys = Object.keys(this.chart);
			if(keys.length > 0){
           	if(this.activeItem >= keys.length){
				this.activeItem = 0;
			}
         var chart = this.chart[keys[this.activeItem]];

         var top = document.createElement("div");
         top.classList.add("list-left");
         
         var artistLogo = document.createElement("p");
         var artistIcon = document.createElement("img");
         artistIcon.classList.add("photo", "list-left");
         if ("http://"+chart.cover != null||'undefined'){
		 artistIcon.src = "http://"+chart.cover;	
		 } else{
		 artistIcon.src = "<img src='modules/MMM-Chart/icons/note.jpg'>";	
		 }
         artistLogo.appendChild(artistIcon);
         top.appendChild(artistLogo);
         
          var side = document.createElement("div");
          side.classList.add("list-right");
         
         var rank = document.createElement("p");
         rank.classList.add("medium", "bright", ".list-row");
         rank.innerHTML = "#"+chart.rank;
         side.appendChild(rank);
              
         var title = document.createElement("p");
         title.classList.add("xsmall", "bright", ".list-row");
         title.innerHTML = "Title: "+chart.title;
         side.appendChild(title);
         
         var artist = document.createElement("p");
         artist.classList.add("xsmall", "bright", "list-row");
         artist.innerHTML = "Artist: "+chart.artist;
         side.appendChild(artist);
         
         var lastrank = document.createElement("p");
         lastrank.classList.add("xsmall", "bright", ".list-row");
         lastrank.innerHTML = "Last Week Rank: #"+chart.position['Last Week'];
         side.appendChild(lastrank);
         
         var peak = document.createElement("p");
         peak.classList.add("xsmall", "bright", ".list-row");
         peak.innerHTML = "Highest spot on chart: #"+chart.position['Peak Position'];
         side.appendChild(peak);
         
         var weeksOn = document.createElement("p");
         weeksOn.classList.add("xsmall", "bright", ".list-row");
         weeksOn.innerHTML = "Weeks on chart: #"+chart.position['Wks on Chart'];
         side.appendChild(weeksOn);
        
         wrapper.appendChild(top);
         wrapper.appendChild(side);
	  }
         return wrapper;
    
     },

     processChart: function(data) {
         this.today = data.Today;
         this.chart = data;
         this.loaded = true;
     },
     
      scheduleCarousel: function() {
         console.log("Scheduling Top 100 Chart...");
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