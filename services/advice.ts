
export const getWeatherAdvice = (temperature: number, condition: string): string => {
  const adviceParts: string[] = [];

  // Temperature-based advice
  if (temperature > 25) {
    adviceParts.push("It's warm outside, so wear light clothing");
  } else if (temperature < 15) {
    adviceParts.push("It's cold outside, so wear a jacket");
  }

  // Condition-based advice
  if (condition.toLowerCase().includes('rain')) {
    adviceParts.push("it might rain, so consider carrying an umbrella");
  } else if (condition.toLowerCase().includes('storm')) {
    adviceParts.push("a storm is expected, so stay safe and carry an umbrella");
  }

  if (adviceParts.length === 0) {
    return "Enjoy the weather!";
  }

  // Join the parts into a single sentence
  return adviceParts.join(' and ') + '.';
};