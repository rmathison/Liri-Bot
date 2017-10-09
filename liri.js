// create vars for required dependencies
var Twitter = require('twitter');
var keys = require('./keys.js');
var prettyjson = require('prettyjson');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

// create var 'client' that takes key info from keys.js which is required to authenticate GET request for twitter
var client = new Twitter(keys.twitterKeys);
// create paramters for command line // param2 will uses splice method to allow for multiple words
var param = process.argv[2];
var param2 = process.argv.splice(3).join(" ");

//same as var client used for twitter, but this is for Spotify authentication which allows the search request

var spotify = new Spotify(keys.spotifyKeys);

// storing twitter get parameter in a variable for later use
var params = { screen_name: 'willoniousfunk', count: 20 };
// storing spotify API request function in a variable to be used in 'fs' readFile function later
var myFunc = function() {

    spotify.search({ type: 'track', query: param2, limit: 1 }, function(err, data) {



        if (err) {
            return console.log('Error occurred: ' + err);

        }

        var preview_url = data.tracks.items[0].preview_url;
        //if this returns null then it will say 'No URL available' rather than just'null'
        if (preview_url === null) {
            preview_url = "No URL Available";
        }

        var song_info = "\n--------------------" + "\nArtist: " +
            data.tracks.items[0].artists[0].name +
            "\nSong Name: " +
            data.tracks.items[0].name +
            "\nPreview Link: " +
            preview_url +
            "\nAlbum: " +
            data.tracks.items[0].album.name + "\n--------------------";

        //prints info to screen
        console.log(song_info);



    });
}
// if statement that initiates twitter request if 'my-tweets' is typed as first parameter in command line
if (param === "my-tweets") {


    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            //array created for later use
            var tweet_data = [];
            // for loop that loops through tweets and selects only specific properties
            for (i in tweets) {
                var data = {
                    "Created": tweets[i].created_at,
                    "Tweet": tweets[i].text,
                    "Retweeted": tweets[i].retweet_count,
                    "Favorited": tweets[i].favorite_count
                };

                //Pushes 'data' into 'tweet_data' array to be console.logged nicely to screen
                tweet_data.push(data);

            }
            console.log(prettyjson.render(tweet_data));

        }

    });
    // if param is this then the following spotify request will be carried out
} else if (param === 'spotify-this-song') {
    // if nothing is entered into parameters then it will default to this:
    if (param2 === "") {
        param2 = "The+Sign+Ace+of+Base";
    }
    //initiates function for spotify previously stored

    myFunc();
    //if paramater one is this then the omdb request will be carried out
} else if (param === 'movie-this') {

    var queryURL = "http://www.omdbapi.com/?t=" + param2 + "&y=&plot=short&apikey=40e9cece";
    //if nothing is entered in 'param' then it will default to 'Mr. Nobody'
    if (param2 === "") {
        queryURL = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=40e9cece"

    }

    request(queryURL, function(error, response, body) {

        //error callback
        if (!error && response.statusCode === 200) {

            //targets JSON and prints selected info to screen
            console.log("-------------------------------------" + "\nMovie Title: " + JSON.parse(body).Title);
            console.log("Actor(s): " + JSON.parse(body).Actors);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);

        }
    });

    //uses 'fs' to read .txt file and enter that info in as parameters to carry out the 'spotify-this-song' function
} else if (param === "do-what-it-says") {
    //reads 'random.txt' file
    fs.readFile("random.txt", "utf8", function(error, data) {

        //selects specific info from the random.txt file to be saves as the new parameters
        //this is an inconvenient way that requires knowledge of exactly how many letters are in a word and where they are in the file
        //I'm sure there is a better way to do this
        var newParam1 = data.substring(0, 17);
        var newParam2 = data.substring(18, 38);
        //sets the parameters to equal the information you pull from the file using substring() method
        param = newParam1;
        param2 = newParam2;

        if (error) {
            return console.log(error);
        }
        //carries out the spotify function using the parameters taken from the 'random.txt' file
        myFunc();





    });

}