export function debugBody(label = "DEBUG_BODY") {
  return (req, _res, next) => {
    console.log(`\n[${label}] ${req.method} ${req.originalUrl}`);
    console.log("params:", req.params);
    console.log("query :", req.query);
    console.log("body  :", req.body);
    next();
  };
}