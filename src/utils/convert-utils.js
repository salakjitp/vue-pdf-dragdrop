const objRemoveNull = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === null) {
      delete object[key];
    }
  });

  return object;
};

const toFixed = (number, limit) => {
  if (number !== null && number !== "" && number !== undefined) {
    return Number(number).toFixed(limit);
  }
  return number;
};

const toCommas = (number, limit) => {
  if (
    number !== null &&
    number !== "" &&
    number !== undefined &&
    typeof number === "number"
  ) {
    // .toLocaleString()
    return Number(number)
      .toFixed(limit)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return number;
};

const JsonToString = (json = null) => {
  try {
    if (json) {
      return JSON.stringify(json);
    } else {
      return json;
    }
  } catch (e) {
    return undefined;
  }
};

const StringToJson = (data = "") => {
  try {
    if (data) {
      return JSON.parse(data);
    } else {
      return data;
    }
  } catch (e) {
    return undefined;
  }
};

const checkFileSize = (file, size) => {
  let check = null;

  if (size === null) {
    size = 2097152;
  }

  //default size => 2097152 = 2MB
  if (file.size > size) {
    check = false;
  } else {
    check = true;
  }

  return check;
};

const formatBytes = (a, b = 2) => {
  if (0 === a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    " " +
    ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  );
};

const isTypeFileImage = (file = []) => {
  const _typeFile = ["image/jpeg", "image/jpg", "image/png"];

  if (file != null) {
    return _typeFile.includes(file.type);
  } else {
    return false;
  }

  // file.forEach((e) => {
  //   let checkType = !_typeFile.includes(e.type); //T ไม่รองรับ
  //   if (checkType) {
  //     return false;
  //   }
  // });

  // return true;
};

const getExtension = (filename) => {
  var parts = filename.split(".");
  return parts[parts.length - 1];
};

const isTypeFilePdf = (file = [], typeFile = []) => {
  const _typeFile =
    typeFile !== null && typeFile.length > 0
      ? typeFile
      : [
          "application/pdf",
          // "image/jpeg",
          // "image/jpg",
          // "image/png",
          // 'application/xls',
          // 'application/xlsx',
          // 'application/docx',
          // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

  file.forEach((e) => {
    let checkType = !_typeFile.includes(e.type); //T ไม่รองรับ
    if (checkType) {
      // response = false
      return false;
    }
  });

  return true;
};

const convertURIToImageData = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      return reject();
    }

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = url;
  });
};

const blobUrlToFile = (blobUrl) =>
  new Promise((resolve) => {
    fetch(blobUrl).then((res) => {
      res.blob().then((blob) => {
        // please change the file.extension with something more meaningful
        // or create a utility function to parse from URL
        const file = new File([blob], "png", { type: blob.type });
        resolve(file);
      });
    });
  });

export default {
  toFixed,
  toCommas,
  JsonToString,
  StringToJson,
  objRemoveNull,
  checkFileSize,
  formatBytes,
  isTypeFilePdf,
  isTypeFileImage,
  convertURIToImageData,
  blobUrlToFile,
};

export {
  toFixed,
  toCommas,
  JsonToString,
  StringToJson,
  objRemoveNull,
  checkFileSize,
  formatBytes,
  isTypeFilePdf,
  isTypeFileImage,
  convertURIToImageData,
  blobUrlToFile,
};
