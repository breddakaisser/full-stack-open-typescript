export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 18.5) {
    return 'Underweight (unhealthy weight)';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal (healthy weight)';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight (unhealthy weight)';
  } else {
    return 'Obese (unhealthy weight)';
  }
};

if (require.main === module) {
  const args = process.argv;
  const heightInput = Number(args[2]);
  const weightInput = Number(args[3]);

  if (
    !isNaN(heightInput) &&
    !isNaN(weightInput) &&
    heightInput > 0 &&
    weightInput > 0
  ) {
    console.log(calculateBmi(heightInput, weightInput));
  } else {
    console.log(
      'Error: Please provide valid numbers for height (cm) and weight (kg).'
    );
    console.log(
      'Example command: npx tsx bmiCalculator.ts 180 74'
    );
  }
}
