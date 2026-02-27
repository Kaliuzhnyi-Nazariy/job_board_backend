import dotenv from "dotenv";
dotenv.config();

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { parseUrl } from "@smithy/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Hash } from "@smithy/hash-node";
import { HttpRequest } from "@smithy/protocol-http";
import { Readable } from "stream";

type S3Body = Buffer | Uint8Array | string | Readable;

const BUCKET_NAME = process.env.BUCKET_NAME || "";
const ACCESS_KEY = process.env.ACCESS_KEY || "";
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "";
const REGION = process.env.REGION || "";

const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const generatePresignedURL = async (
  filename: string,
): Promise<string> => {
  const url = parseUrl(
    `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${filename}`,
  );

  const presigner = new S3RequestPresigner({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
    sha256: Hash.bind(null, "sha256"),
  });

  const presignedURL = await presigner.presign(
    new HttpRequest({ ...url, method: "GET" }),
  );

  return formatUrl(presignedURL);
};

export const uploadFile = async (file: S3Body, fileName: string) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file,
  });

  // const data = await client.send(command);
  await client.send(command);
  // await generatePresignedURL(fileName);

  return;
  // return { downloadLink };
  // return { data, downloadLink };
};

export const deleteFile = async (filename: string): Promise<unknown> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
  });

  return await client.send(command);
};

export const updateFile = async ({
  filename,
  newFilename,
  file,
}: {
  filename: string;
  newFilename: string;
  file: S3Body;
}) => {
  await uploadFile(file, newFilename);
  await deleteFile(filename);
  return;
};

export const getFile = async (filename: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
  });

  return await client.send(command);
};
