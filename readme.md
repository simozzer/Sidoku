An animated solver for sudoko problems, written using ES6, CSS and HTML.

Now updated to use tailwindcss

To try this out simply go here: https://simozzer.github.io/Sidoku/

Can solve even extremely difficult problems e.g 'Shining Mirror' 

*Real time animation currently ENABLED - which slows things down a lot, to change this please set #fast to false, or click the checkbox


It's all about the SPEED: Solving "Shining Mirror" used to take 2 minutes, now it takes 160ms

The hardest example used to take over 2 minutes on my local machine. I've now got that down to less than 0.5 seconds.


Just added 'Escargot AI' as a puzzle, which some on the internet claim is the world's most difficult puzzle. Just like most things on the internet this is a lie.  The most difficult I've found so far is 'Shining Mirror'.

Run with: 

npx @tailwindcss/cli -i ./css/siduko.css -o ./css/output.css --watch