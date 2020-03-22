import fs, { WriteStream } from "fs";

interface ICallback {
  (error: Error, result?: string): void;
}

export class FileSystem {
  public writeToFile(filepath: string, content: string): Error | boolean {
    fs.writeFile(filepath, content, { flag: "a" }, err => {
      if (err) return err;
    });
    return true;
  }

  public readFile(filepath: string, callback: ICallback) {
    fs.readFile(filepath, (err, data) => {
      if (err) callback(err, null);
      else callback(null, data.toString());
    });
  }

  public splitLines(file_contents: string) {
    return file_contents.split("\n");
  }

  public getWriteStream(filepath: string): WriteStream {
    return fs.createWriteStream(filepath);
  }
}
