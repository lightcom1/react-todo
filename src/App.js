import './App.css';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { randomColor } from 'randomcolor';
import Draggable from 'react-draggable';

function App() {
	const [item, setItem] = useState('');
	const [items, setItems] = useState(
		JSON.parse(localStorage.getItem('items')) || []
	);

	useEffect(() => {
		localStorage.setItem('items', JSON.stringify(items));
	}, [items]);

	const newItem = (e = null) => {
		if (item.trim() !== '') {
			const newItem = {
				id: uuid(),
				item,
				color: randomColor({
					luminosity: 'light',
				}),
				defaultPos: {
					x: 50,
					y: -320,
				},
			};
			setItems(items => [...items, newItem]);
			setItem('');
		} else {
			if (e)
				e.target.previousElementSibling.style.borderBottom = '1px solid red';
			setItem('');
		}
	};

	const deleteNote = id => {
		setItems(items.filter(item => item.id !== id));
	};

	const updatePos = (data, i) => {
		let newArr = [...items];
		newArr[i].defaultPos = { x: data.x, y: data.y };
		setItems(newArr);
	};

	const keyPress = e => {
		const code = e.keyCode || e.which;
		if (code === 13) {
			newItem();
			if (!e.target.value) e.target.style.borderBottom = '1px solid red';
		}
	};

	const check = e => {
		if (!e.target.value) {
			e.target.style.borderBottom = '1px solid red';
		} else {
			e.target.style.borderBottom = '1px solid whitesmoke';
		}
	};

	return (
		<div className='App'>
			<div className='wrapper'>
				<input
					value={item}
					type='text'
					placeholder='Enter smth'
					onChange={e => setItem(e.target.value)}
					onKeyPress={e => keyPress(e)}
					onInput={e => check(e)}
				/>
				<button className='enter' onClick={e => newItem(e)}>
					ENTER
				</button>
			</div>

			{items.map((item, i) => {
				return (
					<Draggable
						key={i}
						defaultPosition={item.defaultPos}
						onStop={(_, data) => updatePos(data, i)}>
						<div className='todo__item' style={{ backgroundColor: item.color }}>
							{`${item.item}`}
							<button className='delete' onTouchStart={() => deleteNote(item.id)} onClick={() => deleteNote(item.id)}>
								&times;
							</button>
						</div>
					</Draggable>
				);
			})}
		</div>
	);
}

export default App;
