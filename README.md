# @bbon/Filedownload

[![](https://shields.io/npm/v/@bbon/filedownload)](https://www.npmjs.com/package/@bbon/filedownload) [![](https://shields.io/npm/dt/@bbon/filedownload)](https://www.npmjs.com/package/@bbon/filedownload) [![Build and tag](https://github.com/bbonkr/bbon-filedownload/actions/workflows/build-and-tag.yml/badge.svg)](https://github.com/bbonkr/bbon-filedownload/actions/workflows/build-and-tag.yml) [![publish NPM](https://github.com/bbonkr/bbon-filedownload/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/bbonkr/bbon-filedownload/actions/workflows/publish-npm.yml)

파일 다운로드 코드 조각입니다.

## 설치 Installation

```bash
$ npm install @bbon/filedownload
```

```bash
$ yarn add @bbon/filedownload
```

## 사용 Usage

[`Axios` 패키지](https://www.npmjs.com/package/axios)를 사용하는 경우 예제 코드 조각입니다.

> responseType 을 'blob' 으로 설정해야 합니다.

```typescript
const requestConfig: AxiosRequestConfig = {
    ...Axios.defaults,
    responseType: 'blob',
};

Axios.get(fileDownloadUrl, requestConfig)
    .then((res) => {
        if (res) {
            const contentType =
                res.headers['content-type'] || 'application/octet-stream';
            const helper = new FileDownloadHelper();
            helper.download({
                data: res.data,
                filename: fileName,
                contentType,
            });
        }
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        setLoading(false);
    });
```

전체코드는 [GitHub: bbon-filedownload-sample 저장소](https://github.com/bbonkr/bbon-filedownload-sample)에서 확인하실 수 있습니다.
