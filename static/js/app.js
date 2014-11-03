var movieshelf = movieshelf || {};


(function(){

    movieshelf.controller = {
        //Start de applicatie door de startpunten van alle elementen op de juiste volgorde in te laden.
        init: function() {
            movieshelf.router.init();
            Transparency.render(document.getElementById("mainNavigationList"), movieshelf.content.UpdateDataText.defaultText);
            movieshelf.data.loadData(); 
            movieshelf.sections.init();
        }
    }

    //Rouet die via routie werkt
    movieshelf.router = {
        init: function(){
            routie({
                "about": function() {
                    movieshelf.sections.toggle("about");
                },
                "movies": function() {
                    movieshelf.sections.toggle("movies");
                },
                "details": function() {
                    movieshelf.sections.toggle("details");
                },
                //Detailpagina router
                "movies/:id" : function (id) {
                   movieshelf.sections.getDetail(id, movieshelf.content.movies);
                   movieshelf.sections.openDetail();
                },
                "*" : function () {
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

    //Content die ingeladen wordt door transparency
    movieshelf.content = {
        //Content op about pagina
        about: {
            section1: "Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all.", 
            section2: "I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks.", 
            section3: "Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy.",  
            section4: "That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world."
        },
        //Alle filmdata
        movies: [],
        //Text voor de update data-knop
        UpdateDataText: {
            defaultText: {
                updateButton: "Update Data"
            },
            updating: {
                updateButton: "Updating..."
            },
            done: {
                updateButton: "Done!"
            }
        }
    }

    //Regelt alle verplaatsing van data
    movieshelf.data = {
        //Kijkt of de al in local storage staat. Zo niet, dan haalt hij het op van het web.
        loadData: function() {
            if (localStorage.getItem("movieData") === null) {
                movieshelf.xhr.trigger("GET", "http://dennistel.nl/movies", this.callback);
            } 
            else {
                var parsedData = JSON.parse(localStorage.getItem("movieData"));
                this.dataPlacer(parsedData)
                movieshelf.dataManipulate.reduceReviews();
                movieshelf.sections.loading.instantLoading();
            }
        },
        //Deze functie regelt alles dat pas in de callback uitgevoerd moet worden.
        callback: function(data) {
            localStorage.setItem("movieData", data);
            var parsedData = JSON.parse(localStorage.getItem("movieData"));
            movieshelf.data.dataPlacer(parsedData);
            movieshelf.dataManipulate.reduceReviews();
            movieshelf.sections.loading.done();
            movieshelf.sections.init();
            Transparency.render(document.getElementById("mainNavigationList"), movieshelf.content.UpdateDataText.done);
            var resetLoadingText = function() { Transparency.render(document.getElementById("mainNavigationList"), movieshelf.content.UpdateDataText.defaultText); };
            setTimeout(resetLoadingText, 1000);
        },
        //Zet de data in de browser.
        dataPlacer: function(data) {
            movieshelf.content.movies = data;
        },
        //Updatetet de data handmatig
        updateData: function() {
            Transparency.render(document.getElementById("mainNavigationList"), movieshelf.content.UpdateDataText.updating);
            movieshelf.xhr.trigger("GET", "http://dennistel.nl/movies", this.updateDataCallback);
            var parsedData = JSON.parse(localStorage.getItem("movieData"));
            this.dataPlacer(parsedData);
            movieshelf.dataManipulate.reduceReviews();
        },
        updateDataCallback: function (data) {
            localStorage.setItem("movieData", data);
            var parsedData = JSON.parse(localStorage.getItem("movieData"));
            movieshelf.data.dataPlacer(parsedData);
            movieshelf.dataManipulate.reduceReviews();
            movieshelf.sections.init();
            Transparency.render(document.getElementById("mainNavigationList"), movieshelf.content.UpdateDataText.done);
            var resetLoadingText = function() { Transparency.render(document.getElementById("mainNavigationList"), movieshelf.content.UpdateDataText.defaultText); };
            setTimeout(resetLoadingText, 1000);
        }
    }

    movieshelf.dataManipulate = {
        //Hier gaat de data in, en er komt dezelfde data uit maar dan met reviews die gemiddel berekend zijn.
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
        //Filter functie om de films te filteren op genre
        filter: function(genre, data) {
            var filtered = _.filter(data, function(data){ 
                return _.contains(data.genres, genre);
            });

            movieshelf.sections.movies(filtered);
        }
    }

    //Alle regeling van rendering en animaties.
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
        //Returnet alleen de movie die gelijk staat aan de aangegeven movieId
        getDetail: function (movieId, data) {
            var detailObj = _.filter(data, function (movie) {
                return movie.id == movieId;
            });
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
        },
        //Alle loading animaties worden hier geregeld.
        loading: {
            done: function() {
                document.querySelector("#wrapper").classList.remove("invisibleWrapper");
                document.querySelector("#wrapper").classList.add("animateWrapper");
            },
            instantLoading: function () {
                document.querySelector("#wrapper").classList.remove("invisibleWrapper");
                document.querySelector("#wrapper").classList.add("instantLoading");
            },
        },
        openDetail: function() {
            document.querySelector("#movieDetail").classList.remove("movieDetailOff");
            document.querySelector("#movieDetail").classList.remove("closeMovieDetail");
            document.querySelector("#movieDetail").classList.add("openMovieDetail");
            scrollTo(0,0);
        },
        closeDetail: function() {
            document.querySelector("#movieDetail").classList.add("closeMovieDetail");
            setTimeout(this.movieDetailOff, 1000);
        },
        movieDetailOff: function() {
            document.querySelector("#movieDetail").classList.add("movieDetailOff")
        }
    }

    //Reageert op dropdown: onChange-event
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

    //Deze functie maakt de Local Storage key "movieData" leeg zodat de pagina altijd de data laadt.
    movieshelf.loadSimulator = function() {
        localStorage.removeItem("movieData");
    }
    
    //Comment de loadSimulator uit om het laden van de data te testen.
    //movieshelf.loadSimulator();
    movieshelf.controller.init();
    
    //Hammer.js regeling van de swipe
    var hammertime = new Hammer(document.getElementById("movieDetail"));
        hammertime.on('swiperight', function() {
            movieshelf.sections.closeDetail();
        });
    
})();