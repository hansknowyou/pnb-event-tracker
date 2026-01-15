import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

// Initialize S3 Client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'pnb-knowledge-base';

/**
 * Upload a file to S3
 * @param file - File buffer
 * @param key - S3 object key (path in bucket)
 * @param contentType - MIME type of the file
 * @returns S3 URL of the uploaded file
 */
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Make uploaded images publicly accessible
  });

  await s3Client.send(command);

  // Return the public URL
  return `https://${AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
}

/**
 * Delete a file from S3
 * @param key - S3 object key to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Generate a unique S3 key for knowledge base images
 * @param userId - User ID for organizing files
 * @param filename - Original filename
 * @returns Unique S3 key
 */
export function generateS3Key(userId: string, filename: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `knowledge-base/${userId}/${timestamp}_${sanitizedFilename}`;
}
