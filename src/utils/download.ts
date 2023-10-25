import { AxiosResponse } from "axios";

const download = {
  // 下载文件
  downloadFile: (response: AxiosResponse) => {
    // 内容格式
    const contentDisposition = response.headers["content-disposition"];
    // 提取文件名
    const fileName = extractFilenameFromContentDisposition(contentDisposition);
    // 文件类型
    const mineType = response.headers["content-type"];
    // 创建 blob
    const blob = new Blob([response.data], { type: mineType || "application/octet-stream" });
    // 创建 href 超链接，点击进行下载
    window.URL = window.URL || window.webkitURL;
    const href = URL.createObjectURL(blob);
    const downA = document.createElement("a");
    downA.href = href;
    downA.download = fileName;
    downA.click();
    // 销毁超链接
    window.URL.revokeObjectURL(href);
  }
};

const extractFilenameFromContentDisposition = (contentDisposition?: string | null): string => {
  if (contentDisposition) {
    const parts = contentDisposition.split(";");
    for (let part of parts) {
      part = part.trim();
      if (part.startsWith("filename=")) {
        const fileNamePart = part.substring("filename=".length);
        return decodeURIComponent(fileNamePart);
      }
    }
  }
  return "unknown.xlsx";
};

// const download = {
//   // 下载文件
//   downloadFile: (response: Response) => {
//     // 内容格式
//     const contentDisposition = response.headers.get("Content-Disposition");
//     // 提取文件名
//     const fileName = extractFilenameFromContentDisposition(contentDisposition);
//     // 文件类型
//     const mineType = response.headers.get("Content-Type");
//     // 消费数据
//     response
//       .blob()
//       .then((data) => {
//         // 创建 blob
//         const blob = new Blob([data], { type: mineType || "application/octet-stream" });
//         // 创建 href 超链接，点击进行下载
//         window.URL = window.URL || window.webkitURL;
//         const href = URL.createObjectURL(blob);
//         const downA = document.createElement("a");
//         downA.href = href;
//         downA.download = fileName;
//         downA.click();
//         // 销毁超链接
//         window.URL.revokeObjectURL(href);
//       })
//       .catch((error) => {
//         console.error("Download failed:", error);
//       });
//   }
// };

export default download;
