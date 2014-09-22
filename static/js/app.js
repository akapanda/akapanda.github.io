var jurrien = jurrien || {};

//da
(function(){
    console.log('will this run once?')
    jurrien.controller = {
        init: function() {
            jurrien.content.addMovie('Star Wars', 'Long Ago', 'Love story', 'powpow!');
            jurrien.content.addMovie('Empire', 'Not so long ago', 'Horror story', 'swoosh!');
            console.log(jurrien.content.movies);
        },
    }
    jurrien.router = {
        init: function(){
            routie('about', function() {
                console.log('about has been clicked!')
            })
            routie('movies', function() {
                console.log('movies has been clicked!')
            })
        }
    }
    jurrien.content = {
        about: {
            titel: 'koekjes',
            description: 'taartjes',
        },
        movies: [],
        addMovie: function(title, releaseDate, description, cover){
            this.movies.push(title, releaseDate, description, cover)
        }
    }
    jurrien.sections = {
        about: function(){

        },
        movies: function (){

        }
    }
    jurrien.controller.init();
})();