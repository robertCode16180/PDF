
export class UploadFile {

    name?: string;
    size?: number;
    LastModifiedDate?: Date;
    getfile: File;
    constructor() {
        this.cleanFile();
    }

    setDataFile(file: any): void {
        this.name = file.name;
        this.size = file.size;
        this.LastModifiedDate = file.lastModifiedDate;
        this.getfile = file;
    }

    cleanFile(): void {
        this.name = '';
        this.size = 0;
        this.LastModifiedDate = new Date();
    }
}
