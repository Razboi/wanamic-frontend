
const validateEmail = email => {
	var re = /\S+@\S+\.\S+/;
	return re.test( String( email ).toLowerCase());
};

export default validateEmail;
