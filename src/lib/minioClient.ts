// src/lib/minioClient.ts
import { Client } from 'minio';

const minioClient = new Client({
  endPoint: import.meta.env.VITE_MINIO_ENDPOINT || 'localhost',
  port: parseInt(import.meta.env.VITE_MINIO_PORT || '9000'),
  useSSL: import.meta.env.VITE_MINIO_USE_SSL === 'true',
  accessKey: import.meta.env.VITE_MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: import.meta.env.VITE_MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = import.meta.env.VITE_MINIO_BUCKET || 'cybernark';

// Ensure bucket exists
const ensureBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`Bucket ${BUCKET_NAME} created successfully`);
      
      // Set bucket policy for public read access to uploaded files
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      };
      
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      console.log('Bucket policy set for public read access');
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
  }
};

// Initialize bucket on module load
ensureBucket().catch(console.error);

export { minioClient, BUCKET_NAME };