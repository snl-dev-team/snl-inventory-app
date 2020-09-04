import React from 'react';
import '../../styles/changeLog.css';

const ChangeLog = ({ log }) => {
	return (
		<div className="log-container">
			{log.map((change) => {
				return <Change change={change} key={change.id} />;
			})}
		</div>
	);
};

const Change = ({ change }) => {
	return (
		<div className="change-container">
			<div className="change-date">{change.dateTime}</div>
			<div className="change-spacer"></div>
			<div className="change-message">{change.message}</div>
		</div>
	);
};

export default ChangeLog;
