import db from "../lib/db";

const apply = async ({
  userId,
  jobId,
  coveringLetter,
}: {
  userId: string;
  jobId: string;
  coveringLetter?: string;
}): Promise<void> => {
  try {
    await db.query(
      `INSERT INTO job_applications (user_id, job_id, covering_letter) VALUES ($1, $2, $3)`,
      [userId, jobId, coveringLetter]
    );
    return;
  } catch (error) {
    throw error;
  }
};

export default { apply };
