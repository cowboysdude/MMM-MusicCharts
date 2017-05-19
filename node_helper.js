/* Magic Mirror
 * Module: MMM-MusicCharts
 *
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
var billboard = require("billboard-top-100").getChart;

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting The Top 100 module");
    },

    getChart: function() {
        var self = this;
        billboard(self.config.chart, function(songs, err) {
            if (err) console.log(err);
            var result = songs;
            //console.log(songs);
            self.sendSocketNotification("CHART_RESULT", result);
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
