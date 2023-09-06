import React, { useState } from 'react'
import './App.css'
import { User, userSchema } from './user.dto'
import axios from 'axios'

let requestStatus: null | Promise<any> = null;

function App() {
	let controller = new AbortController()
	const [user, setUser] = useState<User>({ email: '', number: 1 })
	const [number, setNumber] = useState('');
  const [foundList, setFoundList] = useState<Array<User>>([]);


 
	return (
		<div className="search-container">
			<h1 className="search-title">Авторизация</h1>
			<form
				className="search-form"
			>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="text"
						id="email"
						name="email"
						placeholder="Почта"
						value={user.email}
						onChange={(e) => {
							const { value } = e.target
							setUser({ ...user, email: value })
						}}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="number">Пароль</label>
					<input
						type="text"
						id="number"
						name="number"
						placeholder="Number"
						value={number}
						onChange={(e) => {
							const inputValue = e.target.value.replace(/[^0-9]/g, '')
							setUser({ ...user, number: parseInt(inputValue) })
							const formattedValue = inputValue.match(/.{1,2}/g)?.join('-')
							setNumber(formattedValue ?? '')
						}}
					/>
				</div>
				<button
					className="search-button"
					onClick={async (e) => {
						e.preventDefault()
						try {
							await userSchema.validate(user)
						} catch (err) {
							alert('Неверный ввод')
							setNumber('')
							setUser({ email: '', number: 0 })
							return;
						}
						
						if (!requestStatus) {
							requestStatus = axios({
								url: 'http://localhost:3001',
								method: 'post',
								signal: controller.signal,
								data: {
									email: user.email,
									number: user.number,
								},
								headers: {
									'Content-Type': 'application/json',
								},
							})
								.then(function (response) {
									requestStatus = null
									setFoundList(response.data)
								})
								.catch(() => console.log('Rejected request'))
						} else {
							controller.abort()
              
							requestStatus = null;
              controller = new AbortController();
              
							requestStatus = axios({
								url: 'http://localhost:3001',
								method: 'post',
								signal: controller.signal,
								data: {
									email: user.email,
									number: user.number,
								},
								headers: {
									'Content-Type': 'application/json',
								},
							})
								.then(function (response) {
									requestStatus = null
									setFoundList(response.data)
								})
								.catch(() => console.log('Rejected request'))
						}
					}}>
					Искать
				</button>
			</form>
			{foundList.length > 0 ? (
				foundList.map((el, i) => (
					<div key={i}>
						<h1>{el.email}</h1>
						<h2>{el.number}</h2>
					</div>
				))
			) : (
				<></>
			)}
		</div>
	)
}

export default App
