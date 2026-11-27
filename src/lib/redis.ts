import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 1,
  enableReadyCheck: false,
});

export default redis;
