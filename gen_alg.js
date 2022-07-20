'use strict';

const createGeneticAlgorithm = () => {
  /**
   * Creates the next bird generation
   */
  function nextGeneration(birds, copyBirds) {
    birds.length = 0;
    calculateFitness(copyBirds);
    for (let i = 0; i < N_BIRDS; i++) {
      //birds[i] = pickOne(copyBirds);
      birds[i] = pickBest(copyBirds);
    }
    for (let i = 0; i < copyBirds.length; i++) {
      copyBirds[i].dispose();
    }
    copyBirds.length = 0;
  }

  function pickBest(copyBirds) {
    let maxFitness = -1;
    let bird;

    for (let index = 0; index < copyBirds.length; index++) {
      if (copyBirds[index].getFitness() > maxFitness) {
        bird = copyBirds[index];
      }
    }
    let child = createBird(bird.getBrain());
    child.mutate();
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
    child.mutate();
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
