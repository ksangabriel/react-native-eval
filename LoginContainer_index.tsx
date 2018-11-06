import * as React from "react";
import { Item, Input, Icon, Form, Toast } from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";
import Login from "../../stories/screens/Login";
import { connect } from 'react-redux';
import { AsyncStorage } from "react-native"
import API from '../../services/api';

const required = value => (value ? undefined : "Required");
const maxLength = max => value => (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength15 = maxLength(15);
const minLength = min => value => (value && value.length < min ? `Must be ${min} characters or more` : undefined);
const minLength8 = minLength(8);
const email = value =>
	value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? "Invalid email address" : undefined;
const alphaNumeric = value => (value && /[^a-zA-Z0-9 ]/i.test(value) ? "Only alphanumeric characters" : undefined);

export interface Props {
	navigation: any;
	valid: boolean;
}
export interface State {}
class LoginForm extends React.Component<Props, State> {
	textInput: any;
	_form: any;

	renderInput({ input, meta: { touched, error } }) {
		return (
			<Item error={error && touched}>
				<Icon active name={input.name === "email" ? "person" : "unlock"} />
				<Input
					ref={c => (this.textInput = c)}
					placeholder={input.name === "email" ? "Email" : "Password"}
					secureTextEntry={input.name === "password" ? true : false}
					{...input}
				/>
			</Item>
		);
	}

	apiLogin = async() => {

		const {
			email
		  } = this.props;

		
		Toast.show({
			text: email,
			duration: 3000,
			position: "top",
			textStyle: { textAlign: "center" },
		});

		const api = API.create();
		const result1 = await api.login(
		  "form.email", "form.password");

		if(result1.ok)
		{
			Toast.show({
				text: "Successfully logged in!",
				duration: 3000,
				position: "top",
				textStyle: { textAlign: "center" },
			});
			this.props.navigation.navigate("Drawer");
		}
		else 
		{
			Toast.show({
				text: "Login failed![" + result1.ok + "] " +  "form.email "+ "]",
				duration: 3000,
				position: "top",
				textStyle: { textAlign: "center" },
			});
		}

		return result1.ok;
		
	 }

	login() {
		if (this.props.valid) {

			this.apiLogin();
	
		} else {
			Toast.show({
				text: "Enter Valid Username & password!",
				duration: 2000,
				position: "top",
				textStyle: { textAlign: "center" },
			});
		}

	}

	render() {


		const form = (
			<Form>
				<Field name="email" component={this.renderInput} validate={[email, required]} />
				<Field
					name="password"
					component={this.renderInput}
					validate={[alphaNumeric, minLength8, maxLength15, required]}
				/>
			</Form>
		);
		return <Login loginForm={form} onLogin={() => this.login()} />;
	}
}
let LoginContainer = reduxForm({
	form: "login",
})(LoginForm);

const selector = formValueSelector('login');

LoginContainer = connect(state => {
	const { email, password } = selector(state, 'email', 'password');
	return {
		password,
		email
	};
  })(LoginForm);

export default LoginContainer;
