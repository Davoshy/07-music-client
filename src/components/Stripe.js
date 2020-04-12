import React from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import axios from 'axios'

class Stripe extends React.Component {
	state = {
		message: {
			content: '',
			type: ''
		}
	}
	pay = () => {
		this.props.stripe.createToken({}).then(token => {
			console.log(token.data)
			axios
				.post(`${process.env.REACT_APP_API}/pay`, token)
				.then(response => {
					console.log(response.data)
					if (response.data.status == 'succeeded') {
						this.setState({
							message: {
								content: 'Payment successful. Thank you!',
								type: 'success'
							}
						})
						setTimeout(() => {
							window.location = '/'
						}, 2000)
					} else {
						this.setState({
							message: {
								content: response.data.code,
								type: 'error'
							}
						})
					}
				})
				.catch(error => console.log(error))
		})
	}
	getMessageClass = () => {
		if (!this.state.message.type) {
			return ''
		} else if (this.state.message.type === 'success') {
			return 'success'
		} else {
			return 'error'
		}
	}
	render() {
		return (
			<>
				<CardElement />
				{this.state.message ? (
					<div className={this.getMessageClass()}>
						{this.state.message.content}
					</div>
				) : (
					''
				)}
				<button className="submit" onClick={this.pay}>
					Pay
				</button>
			</>
		)
	}
}

export default injectStripe(Stripe)
