"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _db = _interopRequireDefault(require("./db.js"));
var _express = _interopRequireDefault(require("express"));
var _verifyEmail = _interopRequireDefault(require("./routes/verifyEmail.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
var app = (0, _express["default"])();
var PORT = process.env.PORT || 3002;
// Connect to MongoDB
(0, _db["default"])();

// Parse JSON request body
app.use(_express["default"].json());

// Define verification route
app.use('/verify-email', _verifyEmail["default"]);

// Start the server
app.listen(PORT, function () {
  console.log("Verification Server started on port ".concat(PORT));
});
var _default = exports["default"] = app;