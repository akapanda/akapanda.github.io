var movieshelf = movieshelf || {};


(function(){

    movieshelf.controller = {
        init: function() {
            movieshelf.router.init();
            movieshelf.data.loadData();
            movieshelf.dataManipulate.reduceReviews();
            movieshelf.sections.init();
            
        },
    }

    movieshelf.router = {
        init: function(){
            routie({
                'about': function() {
                    movieshelf.sections.toggle("about");
                },
                'movies': function() {
                    movieshelf.sections.toggle("movies");
                },
                'details': function() {
                    movieshelf.sections.toggle("details");
                },
                //zonder # en VAN 1 EEN VAR MAKEN
                'movies/:id' : function (id) {
                   movieshelf.sections.getDetail(id, movieshelf.content.movies);
                },
                '*' : function () {
                    movieshelf.sections.toggle("about");
                },
            });
        }
    }

    movieshelf.xhr = {
        trigger: function(type, url, success, data) {
            var req = new XMLHttpRequest;
            req.open(type, url, true);

            req.setRequestHeader('Content-type','application/json');

            type === 'POST' ? req.send(data) : req.send(null);
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status === 200 || req.status === 201) {
                        success(req.responseText);
                    };
                };
            };
        }
    }

    movieshelf.content = {
        about: {
            header: "About this app",
            section1: "Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all.", 
            section2: "I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks.", 
            section3: "Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy.",  
            section4: "That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world."
        },
        movies: [],
    }

     movieshelf.data = {
        loadData: function() {
            if (localStorage.getItem("movieData") === null) {
                movieshelf.xhr.trigger("GET", "http://dennistel.nl/movies", this.localStore);
                var parsedData = JSON.parse(localStorage.getItem("movieData"));
                this.dataPlacer(parsedData);
            } else {
                var parsedData = JSON.parse(localStorage.getItem("movieData"));
                this.dataPlacer(parsedData)
            }
            
        },
        localStore: function(data) {
            localStorage.setItem("movieData", data);
        },
        dataPlacer: function(data) {
            movieshelf.content.movies = data;
        },
        updateData: function() {
            movieshelf.xhr.trigger("GET", "http://dennistel.nl/movies", this.localStore);
            var parsedData = JSON.parse(localStorage.getItem("movieData"));
            this.dataPlacer(parsedData);
        }
    }

    movieshelf.dataManipulate = {
        reduceReviews: function() {
            _.filter(
                _.map(movieshelf.content.movies, function (movie, i) {
                    movie.reviews = _.reduce(
                        movie.reviews, function(memo, review){   
                                return memo + review.score; 
                            }, 
                            0) / movie.reviews.length;
                            return movie;
                    })
            );
        },
        filter: function(key, array) {
            // filter door de meegegeven array en sla die op in filtered
            var filtered = _.filter(array, function(array){ 
                //return alle objecten die de key in array.genres hebben staan
                return _.contains(array.genres, key);
            });

            movieshelf.sections.movies(filtered);
        },
    }

    movieshelf.sections = {
        init: function() {
            this.about(movieshelf.content.about);
            this.movies(movieshelf.content.movies);
        },
        about: function(data) {
            Transparency.render(document.getElementById("content"), data);
        },
        directives: {
                    cover: {
                        src: function(params) {
                            return this.cover
                        }
                    },
                    detailLink: {
                        href: function(params) {
                            return "#movies/" + this.id
                        }
                    }
            },
        movies: function (data) {
            Transparency.render(document.getElementById("movieInstance"), data, this.directives);
        },
        getDetail: function (key, array) {
            //filter door de array heen en return alleen het object waar het id gelijk staat aan de mee gegeven key
            var detailObj = _.filter(array, function (movie) {
                return movie.id == key;
            });
            // zet de templater aan het werk en stuur alleen het object vanuit de array mee
            this.renderDetail(detailObj[0]);
        },
        renderDetail: function (data) {
            Transparency.render(document.getElementById("movieDetail"), data, this.directives);
        },
        deactivateAll: function () {
            document.querySelector("#about").classList.remove("active");
            document.querySelector("#movies").classList.remove("active");
        },
        toggle: function(section) {
            if (section == "movies") {
                this.deactivateAll();
                document.querySelector("#movies").classList.add("active");
            }
            else if (section == "about") {
                this.deactivateAll();
                document.querySelector("#about").classList.add("active");
            }
        }
    },
    movieshelf.genreFilter = {
        OnChange: function (dropdown) {
        var value = dropdown.options[dropdown.selectedIndex].value;
        if (value == "ShowAll") {
            movieshelf.sections.movies(movieshelf.content.movies);
            }
            else {
                movieshelf.dataManipulate.filter(value, movieshelf.content.movies);
            };
            return true;
        }
    }

    movieshelf.controller.init();
    
})();