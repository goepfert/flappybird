'use strict';

const createGeneticAlgorithm = () => {
  /**
   * Creates the next bird generation
   */

  let bestBird;

  function nextGeneration(birds, copyBirds) {
    birds.length = 0;
    calculateFitness(copyBirds);
    for (let i = 0; i < N_BIRDS; i++) {
      birds[i] = pickOne(copyBirds);
      //birds[i] = pickBest(copyBirds);
    }

    if (bestBird === undefined) {
      bestBird = createBird();
    }

    let bestBird_candidate = pickBest(copyBirds, false);
    if (bestBird_candidate.getFitness() >= bestBird.getFitness()) {
      // bestBird.dispose();
      bestBird = bestBird_candidate;
    } else {
      // bestBird_candidate.dispose();
    }

    for (let i = 0; i < copyBirds.length; i++) {
      copyBirds[i].dispose();
    }

    copyBirds.length = 0;
    copyBirds.push(bestBird);
  }

  function pickBest(copyBirds, doMutate = true) {
    let maxFitness = -1;
    let bird;

    for (let index = 0; index < copyBirds.length; index++) {
      if (copyBirds[index].getFitness() > maxFitness) {
        bird = copyBirds[index];
      }
    }
    let child = createBird(bird.getBrain());
    if (doMutate) {
      child.mutate(0.1, bird.getFitness());
    }
    return child;
  }

  function pickOne(copyBirds) {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r = r - copyBirds[index].getFitness();
      index++;
    }
    index--;
    let bird = copyBirds[index];
    let child = createBird(bird.getBrain());
    child.mutate(0.1, bird.getFitness());
    return child;
  }

  /**
   * Normalize the score of all birds
   * Let's call it fitness
   */
  function calculateFitness(birds) {
    let sum = 0;
    for (let i = 0; i < birds.length; i++) {
      sum += birds[i].getScore();
    }
    // Divide by the sum
    for (let i = 0; i < birds.length; i++) {
      birds[i].setFitness(birds[i].getScore() / sum);
    }
  }

  return {
    nextGeneration,
  };
};
