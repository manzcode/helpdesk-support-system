import multer, { FileFilterCallback } from "multer";
import { middlewareMulter } from "../../middleware/multer";

type MulterWithFilter = multer.Multer & {
  fileFilter: (req: any, file: any, cb: FileFilterCallback) => void;
};

describe("middlewareMulter", () => {
  const mockFileFilter = jest.fn();
  const mockMulter = jest.fn(() => ({
    storage: multer.diskStorage({}),
    limits: {
      fileSize: 1024 * 1024 * 5,
      files: 10,
    },
    fileFilter: mockFileFilter,
  }));

  const arr = [".jpg", ".png"];
  const middleware = middlewareMulter(arr) as MulterWithFilter;

  it("returns a multer instance", () => {
    expect(middleware).toBeInstanceOf(multer); 
  });

  it("calls the multer constructor", () => {
    expect(mockMulter).toHaveBeenCalledTimes(1);
  });

  it("calls the file filter function", () => {
    const mockRequest = {};
    const mockFile = {
      originalname: "test.jpg",
    };
    const mockCallback = jest.fn();

    middleware.fileFilter(mockRequest, mockFile, mockCallback);

    expect(mockFileFilter).toHaveBeenCalledTimes(1);
    expect(mockFileFilter).toHaveBeenCalledWith(null, true);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("throws an error for unsupported file types", () => {
    const mockRequest = {};
    const mockFile = {
      originalname: "test.pdf",
    };
    const mockCallback = jest.fn();

    middleware.fileFilter(mockRequest, mockFile, mockCallback);

    expect(mockFileFilter).toHaveBeenCalledTimes(1);
    expect(mockFileFilter).toHaveBeenCalledWith(
      new Error("Le type de fichier n'est pas pris en charge")
    );
  });
});
