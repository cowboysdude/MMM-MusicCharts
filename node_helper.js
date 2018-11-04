/* Magic Mirror
 * Module: MMM-MusicCharts
 *
 * By Cowboysdude9
 *
 */
const NodeHelper = require('node_helper'); 
const request = require("request");
 
module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting The music chart module");
    },

    getChart: function() {
    request({
        url: "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=" + this.config.apiKey + "&format=json",
        method: 'GET'
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body).tracks.track;

            var charts = [];
            for (var i = 0; i < result.length; i++) {
                var name = result[i].artist.name;
                var title = result[i].name;
                var image = result[i].image[3]['#text'];
				var count = result[i].playcount;

                var chart = {
                    artist: name,
                    track: title,
                    cover: image,
                    rank: i + 1,
					played: count
                };
                charts.push(chart);
            }
            this.sendSocketNotification('CHART_RESULTS', charts);
        } 
    });
},

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
        } else if (notification === 'GET_CHART') {
            this.getChart(payload);
        }
    }
});
