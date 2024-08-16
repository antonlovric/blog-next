import { redisClient } from '../lib/redis';
interface IMetrics {
  visits: number;
  likes: number;
  comments: number;
  shares: number;
}

export const METRIC_WEIGHTS = {
  visits: 0.2,
  likes: 0.3,
  comments: 0.4,
  shares: 0.1,
};

export function incrementPostVisitCount(postId: number) {
  redisClient?.sAdd('post_ids', postId.toString());
  redisClient?.incr(`post:${postId}:visit`);
}

export function incrementPostLikeCount(postId: number) {
  redisClient?.sAdd('post_ids', postId.toString());
  redisClient?.incr(`post:${postId}:like`);
}

export function incrementPostCommentCount(postId: number) {
  redisClient?.sAdd('post_ids', postId.toString());
  redisClient?.incr(`post:${postId}:comment`);
}

export function incrementPostShareCount(postId: number) {
  redisClient?.sAdd('post_ids', postId.toString());
  redisClient?.incr(`post:${postId}:share`);
}

export function calculateRelevanceScore(metrics: IMetrics) {
  const { visits, likes, comments, shares } = metrics;
  return (
    visits * METRIC_WEIGHTS.visits +
    likes * METRIC_WEIGHTS.likes +
    comments * METRIC_WEIGHTS.comments +
    shares * METRIC_WEIGHTS.shares
  );
}

export async function updateRelevanceScores() {
  const postIds = await redisClient?.sMembers('post_ids');

  if (postIds) {
    for (const postId of postIds) {
      const metrics = {
        visits:
          parseInt(
            (await redisClient?.get(`post:${postId}:visit`)) || '0',
            10
          ) || 0,
        likes:
          parseInt(
            (await redisClient?.get(`post:${postId}:like`)) || '0',
            10
          ) || 0,
        comments:
          parseInt(
            (await redisClient?.get(`post:${postId}:comment`)) || '0',
            10
          ) || 0,
        shares:
          parseInt(
            (await redisClient?.get(`post:${postId}:share`)) || '0',
            10
          ) || 0,
      };
      const relevanceScore = calculateRelevanceScore(metrics);

      await redisClient?.zAdd('post_relevance_scores', {
        score: relevanceScore,
        value: postId.toString(),
      });
    }
  }
}

export async function getRelevantPostId() {
  const relevancePostIds = await redisClient?.zRangeByScore(
    'post_relevance_scores',
    0,
    1
  );
  if (relevancePostIds) return parseInt(relevancePostIds?.[0]);
  return 0;
}
