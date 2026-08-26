import { DailyQuote } from '../types';

/**
 * Deterministic Daily Motivation Quote Engine (PAOS Core)
 * 
 * Selects exactly one quote per calendar day in a deterministic, stable manner.
 * No external API dependencies — 100% local, offline-capable, and private.
 */
export function getDailyQuote(quotes: DailyQuote[], date: Date = new Date()): DailyQuote {
  const activeQuotes = quotes.filter((q) => !q.isArchived);

  if (activeQuotes.length === 0) {
    return {
      id: 'fallback-1',
      quote: 'Small progress, repeated consistently, becomes mastery.',
      author: 'PAOS Academic Wisdom',
      category: 'Consistency',
    };
  }

  // Date key: YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  // Deterministic string hash
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    const char = dateKey.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  const positiveIndex = Math.abs(hash) % activeQuotes.length;
  return activeQuotes[positiveIndex];
}
