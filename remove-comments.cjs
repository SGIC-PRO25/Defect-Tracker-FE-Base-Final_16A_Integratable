const fs = require("fs");
const path = require("path");
const stripComments = require("strip-comments");

const extensions = [".js", ".jsx", ".ts", ".tsx"];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== "dist") {
        processDirectory(fullPath);
      }
      continue;
    }

    if (!extensions.includes(path.extname(file))) {
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf8");
    const cleaned = stripComments(content);

    if (content !== cleaned) {
      fs.writeFileSync(fullPath, cleaned, "utf8");
      console.log(`Removed comments: ${fullPath}`);
    }
  }
}

processDirectory(path.join(__dirname, "src"));

console.log("All comments removed.");