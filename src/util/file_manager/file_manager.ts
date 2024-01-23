import { Injectable } from "@nestjs/common";
import * as fs from 'fs';

@Injectable()
export class FileManager {
    dateNow(date?: Date) {
        const dates = date == null ? Date.now() : date;
        return new Intl.DateTimeFormat('fr-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(dates);
    }

    storagePath(folderName: string)
    {
        const folder = `storage/${folderName}/pictures`;

        const path = {
            path: folder
        };

        return path;
    }

    async uploadFile(file: Express.Multer.File, filename: string, category: string)
    {
        const folder = this.storagePath(category);

        filename = filename.replace(' ', '_');

        if (!fs.existsSync(folder.path))
        {
            fs.mkdirSync(folder.path, { recursive: true });
        }

        const fileNameSplit = file.originalname.split('.');
        const fileExt = fileNameSplit[fileNameSplit.length - 1];
        const path = `${folder.path}/${filename}.${fileExt}`;

        fs.writeFileSync(path, file.buffer);

        const location = {
            path: path
        };

        return filename;
    }

    removeImage(path: string) {
        fs.unlinkSync(path);
    }
}