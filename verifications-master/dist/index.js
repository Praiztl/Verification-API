"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FROM = '"Tochukwu chikezie " <tochukwueagles7@gmail.com>';
var REDIRECT_URL = "http://localhost:3000/verifications";
var SUBJECT = "VoiceTome Account Verification";

var Verifications = function () {
	function Verifications() {
		_classCallCheck(this, Verifications);
	}

	_createClass(Verifications, [{
		key: "verify",
		value: async function verify(params) {
			if (!this.isRESTRequest) {
				return await this.database.findOne(params);
			} else {
				return this.database.get("/" + params._id + "/verify");
			}
		}
	}, {
		key: "confirmVerification",
		value: async function confirmVerification(params) {
			if (!this.isRESTRequest) {
				await this.database.findOneAndUpdate({ _id: params._id }, { verified: true });
				var response = await this.database.findOne({ _id: params._id });
				var registrations = new Registrations(this.client, this.config);
				var authentications = new Authentications(this.client, this.config);
				var userprofiles = new UserProfiles(this.client, this.config);
				try {
					var reg = await registrations.findOne({ email: response.email });
					console.log(reg);
					await authentications.save({ email: reg.email, access_token: response._id, password: reg.password, created_at: Date.now(), modified_at: Date.now() });
					await userprofiles.save({ access_token: response._id, basic_info: {}, created_at: Date.now(), modified_at: Date.now() });
				} catch (err) {
					console.log(err);
				}
				response.redirectURL = this.getViewBaseURL(response._id) + "/userprofiles/create";
				console.log(response);
				return response;
			} else {
				return this.database.get(params._id + "/confirm_verification");
			}
		}
	}, {
		key: "sendEmail",
		value: async function sendEmail(data) {
			if (!this.isRESTRequest) {
				try {
					var response = null;
					try {
						response = await this.database.save({
							email: data.email,
							verified: false,
							sent_email: false,
							success: false,
							created_at: Date.now(),
							modified_at: Date.now()
						});
					} catch (err) {
						//response = await this.database.find({email:data.email});
					}
					try {
						var info = await require('./nodemailer').send({
							to: data.to ? data.to : data.email, // list of receivers
							subject: data.subject ? data.subject : SUBJECT, // Subject line
							text: data.text ? data.text : "<b><a href='http://localhost:4000/verifications/" + response._id + "/confirm_verification'>Click to Verify Your Account</a></b>", // plain text body
							html: data.html ? data.html : "<b><a href='http://localhost:4000/verifications/" + response._id + "/confirm_verification'>Click to Verify Your Account</a></b>" // html body
						});
						response = await this.database.findOneAndUpdate({ email: data.email }, {
							sent_email: true,
							success: true,
							modified_at: Date.now()
						}, { new: true });
					} catch (err) {
						throw err;
					}
					response = await this.database.findOne({ email: data.email });
					console.log(response);
					console.log(response._id);
					return response;
				} catch (err) {
					console.log(err);
				}
			} else {
				return this.database.post("/send_email", data);
			}
		}
	}, {
		key: "save",
		value: async function save(data) {
			return this.sendEmail(data);
		}
	}], [{
		key: "getTestAccount",
		value: async function getTestAccount() {

			return _nodemailer2.default.createTestAccount();
		}
	}]);

	return Verifications;
}();

exports.default = Verifications;