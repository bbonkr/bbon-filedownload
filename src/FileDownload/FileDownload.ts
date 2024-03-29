export const DEFAULT_MIMETYPE = 'application/octet-stream';

export type DownloadOptions = {
    /**
     * Data to download
     *
     * @type {(string | ArrayBuffer | ArrayBufferView | Blob)}
     */
    data: string | ArrayBuffer | ArrayBufferView | Blob;
    /**
     * File name
     *
     * @type {string}
     */
    filename: string;

    /**
     * response.headers['content-type']
     *
     * default: application/octet-stream
     *
     * @type {string}
     */
    contentType?: string;
};

export type DownloadFileOptions = DownloadOptions & {
    bom?: string;
};

class FileDownloadHelper {
    /**
     * File download
     *
     * @param {DownloadOptions} options
     * @memberof FileDownloadHelper
     */
    public download(options: DownloadOptions): void {
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

        const navigatorDelegate: any = window.navigator;

        if (typeof navigatorDelegate.msSaveBlob !== 'undefined') {
            navigatorDelegate.msSaveBlob(blob, filename);
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

export default FileDownloadHelper;
