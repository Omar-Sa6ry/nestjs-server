import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SentEmail {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Replace with your SMTP server
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'omar.ahmed.sabry82@gmail.com', 
        pass: 'jtod cntp wgid rrkm ', 
      },
    });
  }


  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: '"NestJS Mailer" <your-email@example.com>', 
      to,
      subject,
      text,
    });

    console.log('Message sent: %s', info.messageId);
  }
}
