require("dotenv").config();

var keys = require("./keys.js");

//Requiring node package managers
var Spotify = require ('node-spotify-api');
var request = require ('request');
var moment = require ('moment');

var spotify = new Spotify(keys.spotify);
//Node file system module
var fs = require ('fs');

//Get node command line arguments
var nodeArgs = process.argv;

var userInput = "";
var otherUserInput = "";

//Get user inputs
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + "%20" + nodeArgs[i];
    }
    else {
        userInput += nodeArgs[i];
    }
    console.log(userInput);
}

for (var i = 3; i < nodeArgs.length; i++){
    otherUserInput = userInput.replace(/%20/g, " ");
}

var command = process.argv[2];
console.log(command);
console.log(process.argv);
goLiri();

//Switch statement for commands
function goLiri() {
    switch (command) {
        case "concert-this":

        //adds userInput to log.txt
        fs.appendFileSync("log.txt", otherUserInput + "\n---------------\n", function (error){
            if (error) {
                console.log(error);
            };
        });

        //bands in town request
        var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
        request(queryURL, function (error, response, body){
            if (!error && response.statusCode === 200){
                //parse json response
                var data = JSON.parse(body);

                for (var i = 0; i < data.length; i++){
                    console.log("Name of Venue: " + data[i].venue.name);
                    //add to log.txt
                    fs.appendFileSync("log.txt", " Name of Venue: " + data[i].venue.name + "\n", function (error){
                        if (error) {
                            console.log(error);
                        };
                    });


                    //Get venue location
                    //if no region
                    if (data[i].venue.region == ""){
                        console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
        
                    //add to log.txt
                    fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.country + "\n", function (error) {
                        if (error) {
                            console.log(error);
                        };
                    });

                } else {
                    console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
                    //add to log.txt
                    fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data.venue.region + ", " + data[i].venue.country + "\n", function (error) {
                        if (error) {
                            console.log(error);
                        };
                    });
                }

                //Get show date
                var date = data[i].datatime;
                date = moment(date).format("MM/DD/YYYY");
                console.log("Date: " + date);
                //add to log.txt
                fs.appendFileSync("log.txt", "Date: " + date + "\n----------\n", function (error) {
                    if (error) {
                        console.log(error);
                    };
                });
                console.log("----------");

                }
            }
        });

        break;
        case "spotify-this-song":
            console.log("here");
            //if no song found
            if (!userInput) {
                userInput = "The%20Sign";
                otherUserInput = userInput.replace(/%20/g, " ");
            }

            //add input to log.txt
            fs.appendFileSync("log.txt", otherUserInput + "\n----------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });

            console.log(spotify);
            spotify.search({

                type: "track",
                query: userInput
            }, function (err, data) {
                if (err) {
                    console.log("Error occured: " + err)
                }

                //assign data to a variable
                var info = data.tracks.items

                //loop through items array
                for (var i = 0; i < info.length; i++){
                    //store album to variable
                    var album = info[i].album;
                    var trackName = info[i].name
                    var preview = info[i].preview_url
                    //store artists to variable
                    var artistsInfo = album.artists

                    //loop through artist info
                    for (var j = 0; j < artistsInfo.length; j++) {
                        console.log("Artist: " + artistsInfo[j].name)
                        console.log("Song Name: " + trackName)
                        console.log("Preview of Song: " + preview)
                        console.log("Album Name: " + album.name)
                        console.log("----------")
                        //add to log.txt
                        fs.appendFileSync("log.txt" , "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of Song: " + preview + "\nAlbum Name: " + album.name + "\n----------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                    }
                }

            })

            break;
        case "movie-this":
            //if no movie provided
            if (!userInput) {
                userInput = "Mr%20Nobody";
                otherUserInput = userInput.replace(/%20/g, " ");
            }

            //add to log.txt
            fs.appendFileSync("log.txt", otherUserInput + "\n-----------\n", function (error) {
              if (error) {
                  console.log(error);
              };
            });

            //OMDB request
            var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var info = JSON.parse(body);
                    console.log("Title: " + info.Title)
                    console.log("Release Year: " + info.Year)
                    console.log("OMDB Rating: " + info.Ratings[0].Value)
                    console.log("Rotten Tomatoes Rating: " + info.Ratings[1].Value)
                    console.log("Country: " + info.Country)
                    console.log("Language: " + info.Language)
                    console.log("Plot: " + info.Plot)
                    console.log("Actors: " + info.Actors)

                    //add to log.txt
                    fs.appendFileSync("log.txt", "Title: " + info.Title + "\nRelease Year: " + info.Year + "\nIMDB Rating: " + info.Ratings[0].Value + "\nRating: " +
                    info.Ratings[1].Value + "\nCountry: " + info.Country + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n----------------\n",
                    function (error) {
                        if (error) {
                            console.log(error);
                        };
                    });
                }
            });

            break;
    }
}

if (command == "do-what-it-says") {
    var fs = require("fs");

    //read random.txt
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        //put data into an array
        var textArr = data.split(",");
        command = textArr[0];
        userInput = textArr[1];
        otherUserInput = userInput.replace(/%20/g, " ");
        goLiri();
    })
}





