var jurrien = jurrien || {};


(function(){
    jurrien.controller = {
        init: function() {
            jurrien.router.init();
            jurrien.content.addMovie("Shawshank Redemption", "14 October 1994", "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.");
            jurrien.content.addMovie("The Godfather", "24 March 1972", "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son");
            jurrien.content.addMovie("Pulp Fiction", "14 October 1994", "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.");
            jurrien.content.addMovie("The Dark Knight", "18 July 2008", "When Batman, Gordon and Harvey Dent launch an assault on the mob, they let the clown out of the box, the Joker, bent on turning Gotham on itself and bringing any heroes down to his level.");
            /* Delete the comments to add the movie "Star Wars" */
            /*
            jurrien.content.addMovie("Star Wars", "15 december 1977", "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the universe from the Empire's world-destroying battle-station, while also attempting to rescue Princess Leia from the evil Darth Vader.");
            */
            jurrien.sections.init();
            console.log("All objects initialized...");
        },
    }
    jurrien.router = {
        init: function(){
            routie({
                'about': function() {
                    jurrien.sections.toggle("about");
                },
                'movies': function() {
                    jurrien.sections.toggle("movies");
                }
            });
        }
    }
    jurrien.content = {
        about: {
            //Content for about. This content is static. This could be made customizable like the addMovie-method, but I decided to make this static to show both ways it can be done.
            header: "About this app",
            section1: "Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all.", 
            section2: "I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks.", 
            section3: "Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy.",  
            section4: "That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world."
        },
        //The array is empty so it's easy to add new movies
        movies: [],
        //addMovie lets you easily add movies to the list
        //At this moment (23/9/2014) I don't know how to add movie cover-images. I have experimented with changing the contents of the src property, 
        //but it doesn't seem to accept being in an array like the movies-array. Please fork my code and help me if you want to!
        addMovie: function(title, releaseDate, description, cover){
            var movieMaker = {
                movieTitle: title,
                movieReleaseDateLabel: "Release date: ",
                movieReleaseDate: releaseDate,
                movieDescription: description
            }
            this.movies.push(movieMaker);
        }
        
    }
    jurrien.sections = {
        init: function() {
            jurrien.sections.about();
            jurrien.sections.movies();
        },
        about: function() {
            Transparency.render(document.getElementById("content"), jurrien.content.about);
        },
        movies: function (){
            Transparency.render(document.getElementById("movieInstance"), jurrien.content.movies);
        },
        toggle: function(section) {
            if (section == "movies") {
                document.querySelector("#movies").classList.add("active");
                document.querySelector("#about").classList.remove("active");
            }
            else if (section == 'about') {
                document.querySelector("#about").classList.add("active");
                document.querySelector("#movies").classList.remove("active");
            };
        }
    }
    //This function will initialize all systems.
    jurrien.controller.init();
})();