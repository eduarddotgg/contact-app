import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  NoSuchKey,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { APP_ERROR_CODE } from "../constants";
import { AppError } from "../errors";
import { logger } from "../logger";
import { s3Bucket, s3Client } from "../s3-client";
import { S3_ERROR } from "./s3.errors";

type ObjectResult = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
};

const isNotFound = (error: unknown): boolean => {
  if (error instanceof NoSuchKey) return true;
  if (error && typeof error === "object") {
    const meta = error as { $metadata?: { httpStatusCode?: number }; name?: string };
    if (meta.$metadata?.httpStatusCode === 404) return true;
    if (meta.name === "NotFound" || meta.name === "NoSuchKey") return true;
  }
  return false;
};

export namespace S3 {
  export const ensureBucket = async () => {
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: s3Bucket }));
      return;
    } catch (error) {
      if (!isNotFound(error)) {
        logger.error("Error while checking S3 bucket: ", { error, bucket: s3Bucket });
        throw new AppError(APP_ERROR_CODE.INTERNAL_SERVER_ERROR, S3_ERROR.INTERNAL, {
          bucket: s3Bucket,
        });
      }
    }

    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: s3Bucket }));
      logger.info("Created S3 bucket", { bucket: s3Bucket });
    } catch (error) {
      logger.error("Error while creating S3 bucket: ", { error, bucket: s3Bucket });
      throw new AppError(APP_ERROR_CODE.INTERNAL_SERVER_ERROR, S3_ERROR.INTERNAL, {
        bucket: s3Bucket,
      });
    }
  };

  export const put = async (key: string, body: Buffer | Uint8Array, contentType: string) => {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3Bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
    } catch (error) {
      logger.error("Error while putting S3 object: ", { error, key });
      throw new AppError(APP_ERROR_CODE.INTERNAL_SERVER_ERROR, S3_ERROR.INTERNAL, { key });
    }
  };

  export const get = async (key: string): Promise<ObjectResult> => {
    try {
      const response = await s3Client.send(new GetObjectCommand({ Bucket: s3Bucket, Key: key }));

      if (!response.Body) {
        throw new AppError(APP_ERROR_CODE.NOT_FOUND, S3_ERROR.NOT_FOUND, { key });
      }

      return {
        body: response.Body.transformToWebStream(),
        contentType: response.ContentType ?? "application/octet-stream",
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      if (isNotFound(error)) {
        throw new AppError(APP_ERROR_CODE.NOT_FOUND, S3_ERROR.NOT_FOUND, { key });
      }

      logger.error("Error while getting S3 object: ", { error, key });
      throw new AppError(APP_ERROR_CODE.INTERNAL_SERVER_ERROR, S3_ERROR.INTERNAL, { key });
    }
  };

  export const remove = async (key: string) => {
    try {
      await s3Client.send(new DeleteObjectCommand({ Bucket: s3Bucket, Key: key }));
    } catch (error) {
      if (isNotFound(error)) return;
      logger.error("Error while removing S3 object: ", { error, key });
      throw new AppError(APP_ERROR_CODE.INTERNAL_SERVER_ERROR, S3_ERROR.INTERNAL, { key });
    }
  };
}
