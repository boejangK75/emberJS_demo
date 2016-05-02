/** ================= PORT AND IP ================= */
exports.appPort = 3000;
exports.appIp = "localhost";

/** ================= DB CONFIGS ================= */
var dbName = 'db_test';
var dbaddr1 = '127.0.0.1'; 

exports.mongooseOptions = {
	user: '',
	pass: '',
};
exports.dbConnectionPath = "mongodb://"+dbaddr1+"/"+dbName;