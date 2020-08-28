import React from 'react';

const ChangeLog = ({ obj }) => {
	const log = Object.entries(obj.changeLog).map((entry) => {
		return { ...entry[1], id: entry[0] };
	});

	return (
		<div className="log-container">
			{log.map((item) => {
				return <h1>{`${item.dateTime}: ${item.message}`}</h1>;
			})}
		</div>
	);
};

export default ChangeLog;
