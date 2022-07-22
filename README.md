# Flappy Bird

Plain javascript browser game clone of *Flappy Bird*. Play it yourself or let the machine learn it!

Learning process is heavily inspired by

* https://www.youtube.com/watch?v=c6y21FkaUqw
* https://www.youtube.com/watch?v=cdUNkwXx-I4&t=156s

which uses a neural network that is *trained* (actually not really) by a neuro evolution process similar to a genetic algorithm.

The birdies start with a pretty simple brain (1 Layers) that is randomly generated. After each iteration a new set of birds is created from best ones from the previous iteration. Their brain (the network) is copied over and is mutated. Then a new season start ... and we'll see if the come after their parents and survice longer.

Check the [Demo](https://goepfert.github.io/flappybird/).



