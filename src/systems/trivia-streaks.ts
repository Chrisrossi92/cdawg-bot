type TriviaStats = {
  currentStreak: number;
  bestStreak: number;
  totalCorrect: number;
  totalWrong: number;
};

const triviaStatsByUserId: Record<string, TriviaStats> = {};

function getOrCreateTriviaStats(userId: string): TriviaStats {
  if (!triviaStatsByUserId[userId]) {
    triviaStatsByUserId[userId] = {
      currentStreak: 0,
      bestStreak: 0,
      totalCorrect: 0,
      totalWrong: 0,
    };
  }

  return triviaStatsByUserId[userId];
}

export function recordCorrectTriviaAnswer(userId: string) {
  const stats = getOrCreateTriviaStats(userId);
  const nextStreak = stats.currentStreak + 1;

  stats.currentStreak = nextStreak;
  stats.bestStreak = Math.max(stats.bestStreak, nextStreak);
  stats.totalCorrect += 1;

  const bonusXpByStreak: Record<number, number> = {
    2: 2,
    3: 4,
    5: 8,
  };

  return {
    streak: nextStreak,
    bonusXp: bonusXpByStreak[nextStreak] ?? 0,
  };
}

export function resetTriviaStreak(userId: string) {
  const stats = getOrCreateTriviaStats(userId);
  stats.currentStreak = 0;
  stats.totalWrong += 1;
}

export function getTriviaStats(userId: string): TriviaStats {
  const stats = getOrCreateTriviaStats(userId);

  return {
    currentStreak: stats.currentStreak,
    bestStreak: stats.bestStreak,
    totalCorrect: stats.totalCorrect,
    totalWrong: stats.totalWrong,
  };
}

export function getTopTriviaUsers(limit: number) {
  return Object.entries(triviaStatsByUserId)
    .sort((a, b) => {
      const correctDelta = b[1].totalCorrect - a[1].totalCorrect;

      if (correctDelta !== 0) {
        return correctDelta;
      }

      return b[1].bestStreak - a[1].bestStreak;
    })
    .slice(0, limit)
    .map(([userId, stats]) => ({
      userId,
      totalCorrect: stats.totalCorrect,
      bestStreak: stats.bestStreak,
    }));
}
