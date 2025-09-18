import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'image' },
          (error: unknown, result: { secure_url?: string } | undefined) => {
            if (error) {
              if (error instanceof Error) {
                return reject(error);
              }
              return reject(new Error('Cloudinary upload error'));
            }
            resolve(result?.secure_url ?? '');
          },
        )
        .end(file.buffer);
    });
  }
}
