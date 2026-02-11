import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException, Get, Param, Res, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Public } from '../decorators/public.decorator';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('media')
@UseGuards(ApiKeyGuard)
export class MediaController {

    // Ensure upload directories exist
    private ensureDirectoryExists(directory: string) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    // Get storage configuration based on upload type
    private getStorageConfig(uploadType: 'blogs' | 'news' | 'general' = 'general') {
        const baseDir = './uploads';
        const subDir = uploadType === 'general' ? '' : `/${uploadType}`;
        const destination = `${baseDir}${subDir}`;

        return diskStorage({
            destination: (req, file, callback) => {
                this.ensureDirectoryExists(destination);
                callback(null, destination);
            },
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                const filename = `file-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        });
    }

    // File filter for validation
    private fileFilter = (req, file, callback) => {
        // Allow images, videos, and 3D models (glb, gltf)
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|glb|gltf|bin)$/i)) {
            return callback(new BadRequestException('Unsupported file format'), false);
        }
        callback(null, true);
    };

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

    // Upload blog featured image
    @Post('upload/blog/featured')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit for images
        },
    }))
    async uploadBlogFeaturedImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const destination = './uploads/blogs';
        this.ensureDirectoryExists(destination);

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `featured-${uniqueSuffix}${ext}`;
        const filepath = path.join(destination, filename);

        fs.writeFileSync(filepath, file.buffer);

        return {
            url: `/uploads/blogs/${filename}`,
            filename: filename,
            mimetype: file.mimetype,
            size: file.size
        };
    }

    // Upload blog gallery images (multiple)
    @Post('upload/blog/gallery')
    @UseInterceptors(FilesInterceptor('files', 10, {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit per image
        },
    }))
    async uploadBlogGallery(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        const destination = './uploads/blogs';
        this.ensureDirectoryExists(destination);

        const uploadedFiles = files.map((file, index) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = extname(file.originalname);
            const filename = `gallery-${uniqueSuffix}${ext}`;
            const filepath = path.join(destination, filename);

            fs.writeFileSync(filepath, file.buffer);

            return {
                url: `/uploads/blogs/${filename}`,
                filename: filename,
                mimetype: file.mimetype,
                size: file.size,
                order: index
            };
        });

        return {
            files: uploadedFiles,
            count: uploadedFiles.length
        };
    }

    // Upload news featured image
    @Post('upload/news/featured')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit for images
        },
    }))
    async uploadNewsFeaturedImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const destination = './uploads/news';
        this.ensureDirectoryExists(destination);

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `featured-${uniqueSuffix}${ext}`;
        const filepath = path.join(destination, filename);

        fs.writeFileSync(filepath, file.buffer);

        return {
            url: `/uploads/news/${filename}`,
            filename: filename,
            mimetype: file.mimetype,
            size: file.size
        };
    }

    // Upload news gallery images (multiple)
    @Post('upload/news/gallery')
    @UseInterceptors(FilesInterceptor('files', 10, {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit per image
        },
    }))
    async uploadNewsGallery(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        const destination = './uploads/news';
        this.ensureDirectoryExists(destination);

        const uploadedFiles = files.map((file, index) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = extname(file.originalname);
            const filename = `gallery-${uniqueSuffix}${ext}`;
            const filepath = path.join(destination, filename);

            fs.writeFileSync(filepath, file.buffer);

            return {
                url: `/uploads/news/${filename}`,
                filename: filename,
                mimetype: file.mimetype,
                size: file.size,
                order: index
            };
        });

        return {
            files: uploadedFiles,
            count: uploadedFiles.length
        };
    }

    @Public()
    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        const root = './uploads';
        res.sendFile(filename, { root });
    }

    @Public()
    @Get('blogs/:filename')
    serveBlogFile(@Param('filename') filename: string, @Res() res: Response) {
        const root = './uploads/blogs';
        res.sendFile(filename, { root });
    }

    @Public()
    @Get('news/:filename')
    serveNewsFile(@Param('filename') filename: string, @Res() res: Response) {
        const root = './uploads/news';
        res.sendFile(filename, { root });
    }
}
