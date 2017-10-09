var Twitter = require('twitter');
var keys = require('./keys.js');
var prettyjson = require('prettyjson');
var Spotify = require('node-spotify-api');
var request = require("request");


var client = new Twitter(keys);
var param = process.argv[2];
var param2 = process.argv.splice(3).join(" ");

var params = { screen_name: 'willoniousfunk', count: 20 };

if (param === "my-tweets") {


    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var tweet_data = [];

            for (i in tweets) {
                var data = {
                    "Created": tweets[i].created_at,
                    "Tweet": tweets[i].text,
                    "Retweeted": tweets[i].retweet_count,
                    "Favorited": tweets[i].favorite_count
                };
                tweet_data.push(data);

            }
            console.log(prettyjson.render(tweet_data));

        }

    });

} else if (param === 'spotify-this-song') {

    var spotify = new Spotify({
        id: 'd723aa9a7c2a4206b436070611d030f3',
        secret: '6eb4844bdd4446908df20ed96ee75cbb'
    });

    spotify.search({ type: 'track', query: param2, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);

        }

        var song_info = "Artist: " +
            data.tracks.items[0].artists[0].name +
            "\nSong Name: " +
            data.tracks.items[0].name +
            "\nPreview Link: " +
            data.tracks.items[0].preview_url +
            "\nAlbum: " +
            data.tracks.items[0].album.name;

        console.log(prettyjson.render(song_info));

    });

} else if (param === 'movie-this') {

    request("http://www.omdbapi.com/?t=" + param2 + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {

        if (!error && response.statusCode === 200) {

            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Year of Release: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Countries produced in: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Movie Plot: " + JSON.parse(body).Plot);
            console.log("Actor(s): " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1]);
        }
    });

}