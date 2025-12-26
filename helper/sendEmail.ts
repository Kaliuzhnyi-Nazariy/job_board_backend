import Mailjet from "node-mailjet";

const { API_KEY_MAIL, SECRET_KEY_MAIL } = process.env;

const mailjet = Mailjet.apiConnect(API_KEY_MAIL!, SECRET_KEY_MAIL!);

interface MailData {
  email: string;
  fullName: string;
  tokenId: string;
}

export interface MailResult {
  ok: boolean;
}

export const sendEmail = async ({
  email,
  fullName,
  tokenId,
}: MailData): Promise<MailResult> => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "ychebakn@gmail.com",
            Name: "Job Board",
          },
          To: [
            {
              Email: email,
              Name: fullName,
            },
          ],
          Subject: "Your email flight plan!",
          TextPart: "Dear passenger, welcome to Mailjet!",
          HTMLPart: `<div><h3>Welcome to Job Board!</h3>
            <a href='http://localhost:5173/reset-password/${tokenId}' target='_blank'>Reset password</a>
          </div>`,
        },
      ],
    });

    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
};

// interface MailResult {
//   ok: boolean;
// }

// export const sendEmail = ({
//   email,
//   fullName,
// }: MailData): Promise<MailResult> => {
//   const request = mailjet.post("send", { version: "v3.1" }).request({
//     Messages: [
//       {
//         From: {
//           Email: "ychebakn@gmail.com",
//           Name: "Job Board",
//         },
//         To: [
//           {
//             Email: email,
//             // Email: "kaliuzhnyinazariijob@gmail.com",
//             Name: fullName,
//           },
//         ],

//         Subject: "Your email flight plan!",
//         TextPart:
//           "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
//         HTMLPart:
//           '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
//       },
//     ],
//   });
//   request
//     // .then((result) => {
//     .then(() => {
//       // console.log("send email result: ", result);
//       return { ok: true };
//     })
//     .catch(() => {
//       return { ok: false };
//     });
//   // .catch((err) => {
//   //   console.log(err);
//   //   console.log("send email error: ", err.statusCode);
//   // });
// };

// export default sendEmail;
