import express from 'express';
import { calculateBmi } from './bmiCalculator';

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (hours: number[], target: number): ExerciseResult => {
  const periodLength = hours.length;
  const trainingDays = hours.filter(hours => hours > 0).length;
  const average = hours.reduce((sum, value) => sum + value, 0) / periodLength;
  const success = average >= target;
  const rating = success ? 3 : average >= target / 2 ? 2 : 1;
  const ratingDescription = rating === 3
    ? 'excellent'
    : rating === 2
      ? 'not too bad but could be better'
      : 'try harder';

  return { periodLength, trainingDays, success, rating, ratingDescription, target, average };
};

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

// GET Endpoint for BMI
app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmiDescription = calculateBmi(height, weight);
  return res.json({
    weight,
    height,
    bmi: bmiDescription
  });
});

// POST Endpoint for Exercises
app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  const targetNum = Number(target);
  if (!Array.isArray(daily_exercises) || isNaN(targetNum)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const exercises = daily_exercises.map(h => Number(h));
  if (exercises.some(h => isNaN(h))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(exercises, targetNum);
  return res.json(result);
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


