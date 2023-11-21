
import nodemailer from "nodemailer";


const FROM='"Tochukwu chikezie " <tochukwueagles7@gmail.com>';
const REDIRECT_URL="http://localhost:3000/verifications";
const SUBJECT="VoiceTome Account Verification";




export default class Verifications {
	static async getTestAccount() {
	
	  return nodemailer.createTestAccount();
	}


	async verify(params){
		if(!this.isRESTRequest){
			return  await this.database.findOne(params);
		}
		else{
			return this.database.get(`/${params._id}/verify`);
		}
	}



	async confirmVerification(params){
		if(!this.isRESTRequest){
			await this.database.findOneAndUpdate({_id:params._id}, {verified:true});
			const response = await this.database.findOne({_id:params._id});
			const registrations = new Registrations(this.client, this.config);
			const authentications = new Authentications(this.client, this.config);
			const userprofiles = new UserProfiles(this.client, this.config);
			try{
				const reg = await registrations.findOne({email:response.email});
				console.log(reg);
				await authentications.save({email:reg.email, access_token:response._id, password:reg.password, created_at:Date.now(), modified_at:Date.now()})
				await userprofiles.save({access_token:response._id,basic_info:{},created_at:Date.now(), modified_at:Date.now()})
			}
			catch(err){
				console.log(err)
			}
			response.redirectURL=`${this.getViewBaseURL(response._id)}/userprofiles/create`;
			console.log(response);
			return response;
		}
		else{
			return this.database.get(`${params._id}/confirm_verification`);
		}
	
	}


	async sendEmail(data) { 
		if(!this.isRESTRequest){
			try{
				let response= null;
				try{
					response = await this.database.save({
						email:data.email,
						verified:false,
						sent_email:false,
						success:false,
						created_at:Date.now(),
						modified_at:Date.now()
					});	
				}
				catch(err){
					//response = await this.database.find({email:data.email});
				}
				try{
					let info = await require('./nodemailer').send({
				    to: data.to?data.to:data.email, // list of receivers
				    subject: data.subject?data.subject:SUBJECT, // Subject line
				    text: data.text?data.text:`<b><a href='http://localhost:4000/verifications/${response._id}/confirm_verification'>Click to Verify Your Account</a></b>`, // plain text body
				    html: data.html?data.html:`<b><a href='http://localhost:4000/verifications/${response._id}/confirm_verification'>Click to Verify Your Account</a></b>`, // html body
				  });
				  response=await this.database.findOneAndUpdate({email:data.email}, {
						sent_email:true,
						success:true,
						modified_at:Date.now()
					}, {new:true})
				}
				catch(err){
					throw (err)
				}
			  response = await this.database.findOne({email:data.email});
			  console.log(response);
			  console.log(response._id);
			  return response;
			}
			catch(err){
				console.log(err);
			}
		}	
		else{
			return this.database.post("/send_email", data);
		}
	}



	async save(data){
		return this.sendEmail(data);
	}
}	