export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (exerciseHours: number[], target: number): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter(hours => hours > 0).length;
  const totalHours = exerciseHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating = 1;
  let ratingDescription = 'too bad, try harder next time';

  if (average >= target) {
    rating = 3;
    ratingDescription = 'fantastic job, target achieved!';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

// Parse arguments from the terminal command line
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Error: Please provide a target and at least one day of exercise hours.');
  console.log('Example: node --experimental-strip-types exerciseCalculator.ts 2 3 0 2 4.5');
} else {
  const targetInput = Number(args[0]);
  const hoursInput = args.slice(1).map(h => Number(h));

  const hasInvalidNumbers = isNaN(targetInput) || hoursInput.some(h => isNaN(h));

  if (hasInvalidNumbers) {
    console.log('Error: All provided values must be valid numbers!');
  } else {
    console.log(calculateExercises(hoursInput, targetInput));
  }
}
