import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import { Public } from '../decorators/public.decorator';

@Controller('media')
export class MediaController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                const filename = `file-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        fileFilter: (req, file, callback) => {
            // Allow images, videos, and 3D models (glb, gltf)
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|glb|gltf|bin)$/i)) {
                return callback(new BadRequestException('Unsupported file format'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB limit for 3D/Video
        },
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        return {
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size
        };
    }

    @Public()
    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        const root = './uploads';
        res.sendFile(filename, { root });
    }
}
