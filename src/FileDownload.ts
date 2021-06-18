const DEFAULT_MIMETYPE = 'application/octet-stream';

type DownLoadOptions = {
    /**
     * data
     */
    data: string | ArrayBuffer | ArrayBufferView | Blob;
    /**
     * file name
     */
    filename: string;
    /**
     * response.headers['content-type']
     *
     * default: application/octet-stream
     */
    contentType?: string;
};

type DownloadFileOptions = DownLoadOptions & {
    bom?: string;
};

export class FileDownloadHelper {
    public download(options: DownLoadOptions): void {
        if (typeof window === 'object') {
            const { data, contentType, filename } = options;
            const contentTypeValue = contentType || 'application/octet-stream';

            this.downloadFile({
                data: data,
                filename: filename,
                contentType: contentTypeValue,
            });
        }
    }

    private downloadFile(options: DownloadFileOptions): void {
        const { data, filename, contentType: mime, bom } = options;
        const blobData: BlobPart[] =
            typeof bom !== 'undefined' ? [bom, data] : [data];

        const blob = new Blob(blobData, {
            type: mime || DEFAULT_MIMETYPE,
        });

        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const blobURL = window.URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', filename);
            tempLink.setAttribute('target', '_self'); // fix: WebKitBlobResource error 1

            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }

            document.body.appendChild(tempLink);
            tempLink.click();

            window.setTimeout(() => {
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobURL);
            }, 0);
        }
    }
}
