import fs from "fs";
import path from "path";

export const ensureDirectoryExists = (directoryPath) => {
  try {
    // Check if directory exists, if not, create it
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory created: ${directoryPath}`);
    }
  } catch (error) {
    console.error(`Error creating directory: ${error.message}`);
  }
};
