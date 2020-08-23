import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const useStyles = makeStyles({
  root: {
    flexGrow: 100,
  },
});

function CenteredTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        centered
      >
        <Tab label="lot" onClick={() => props.onSet("lots")}/>
        <Tab label="sku" onClick={() => props.onSet("skus")}/>
        <Tab label="raw material" onClick={() => props.onSet("mats")}/>

      </Tabs>
    </div>
  );
}
export default CenteredTabs