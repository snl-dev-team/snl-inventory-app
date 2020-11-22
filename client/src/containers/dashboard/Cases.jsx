import React, { useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router';
import CaseCard from '../../components/CaseCard';
import { fetchCases } from '../../actions/case';
import UpsertCaseDialog from '../../components/UpsertCaseDialog';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const CasesDashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    dispatch(fetchCases(token));
  }, [dispatch, token]);

  const cases = useSelector(
    (state) => Object.values(state.cases),
    (before, after) => JSON.stringify(before) === JSON.stringify(after),
  );

  return (
    <div>
      <Grid container spacing={3}>
        {cases.map((case_) => (
          <Grid key={case_.id}>
            <CaseCard
              id={case_.id}
              name={case_.name}
              productName={case_.productName}
              productCount={case_.productCount}
              count={case_.count}
              number={case_.number}
              expirationDate={case_.expirationDate}
              dateCreated={case_.dateCreated}
              dateModified={case_.dateModified}
              shipped={case_.shipped}
            />
          </Grid>
        ))}
      </Grid>
      <Fab
        size="medium"
        color="secondary"
        aria-label="add"
        className={classes.margin}
        onClick={() => history.push('/cases/add')}
      >
        <AddIcon />
      </Fab>

      <Route
        exact
        path="/cases/add"
        component={UpsertCaseDialog}
      />

      <Route
        exact
        path="/cases/edit/:id"
        component={UpsertCaseDialog}
      />
    </div>
  );
};

export default CasesDashboard;
