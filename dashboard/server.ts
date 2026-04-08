import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const host = process.env.DASHBOARD_HOST || "127.0.0.1";
const port = Number(process.env.DASHBOARD_PORT || "4173");

const contentTypesByExtension: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function getFilePath(urlPath: string) {
  const normalizedPath = urlPath === "/" ? "/index.html" : urlPath;
  const resolvedPath = path.normalize(path.join(publicDir, normalizedPath));
  return resolvedPath.startsWith(publicDir) ? resolvedPath : null;
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const filePath = getFilePath(requestUrl.pathname);

  if (!filePath) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  fs.readFile(filePath, (error, fileContents) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    const contentType = contentTypesByExtension[extension] ?? "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
    });
    response.end(fileContents);
  });
});

server.on("error", (error) => {
  console.error("[dashboard] server error:", error);
});

server.listen(port, host, () => {
  console.log(`[dashboard] listening on http://${host}:${port}`);
});
