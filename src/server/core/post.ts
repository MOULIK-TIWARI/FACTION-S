import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'Reddit Factions',
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Join the Battle!',
      description: 'Choose your faction and battle for supremacy! Vote daily on Attack, Defend, or Train actions. Will your faction dominate the leaderboard?',
      entryUri: 'index.html',
      heading: '⚔️ Reddit Factions War',
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameType: 'factions',
      version: '1.0',
    },
    subredditName: subredditName,
    title: '⚔️ Reddit Factions - Join the Epic Battle!',
  });
};
