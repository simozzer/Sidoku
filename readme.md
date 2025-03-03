An animated solver for sudoko problems, written using ES6, CSS and HTML.

Now updated to use tailwindcss

To try this out simply go here: https://simozzer.github.io/Sidoku/

Can solve even extremely difficult problems e.g 'Shining Mirror' (though this can take a long time, particularly if using real-time animation)*

*Real time animation currently disabled, to change this please set #fast to false (  `https://github.com/simozzer/Sidoku/blob/34814a79cb563d2cb03e4de4d028cdabbd4a4748/sidmain.js#L363 ).


It's all about the SPEED: A 24000% speed improvement over my 1st attempt at solving "Shining Mirror".

The hardest example used to take over 2 minutes on my local machine. I've now got that down to less than 0.5 seconds.


Just added 'Escargot AI' as a puzzle, which some on the internet claim is the world's most difficult puzzle. Just like most things on the internet this is a lie.  The most difficult I've found so far is 'Shining Mirror'.

Run with: 

npx @tailwindcss/cli -i ./css/siduko.css -o ./css/output.css --watch