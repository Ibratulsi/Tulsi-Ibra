const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const pages = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/quiz.html", "quiz.html"],
  ["/surprise.html", "surprise.html"],
  ["/little-us.html", "little-us.html"],
  ["/scroll.html", "scroll.html"],
  ["/n", "notes.html"],
  ["/notes.html", "notes.html"],
]);
const images = new Map([
  ["/public/Ibra.kid.jpeg", "Ibra.kid.jpeg"],
  ["/public/Tulsi.kid.jpeg", "Tulsi.kid.jpeg"],
]);

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  const pageName = pages.get(pathname);
  const imageName = images.get(pathname);
  if (!pageName && !imageName) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }

  try {
    const filePath = pageName
      ? path.join(__dirname, pageName)
      : path.join(__dirname, "public", imageName);
    const page = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": pageName ? "text/html; charset=utf-8" : "image/jpeg",
      "Content-Length": page.length,
    });
    response.end(request.method === "HEAD" ? undefined : page);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Unable to load the page");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Love note server running at http://localhost:${port}`);
});
