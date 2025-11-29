import app from './app.js';
var PORT = process.env.PORT || 4000;
var server = app.listen(PORT, function () {
  console.log("App is listening to port " + PORT);
});
export default server;