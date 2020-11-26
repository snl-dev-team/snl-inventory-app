import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import InventoryCard from '../../components/InventoryCard';
import UpsertCaseDialog from '../../components/UpsertCaseDialog';
import { GET_CASES, DELETE_CASE } from '../../graphql/cases';

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

const CasesDashboard = ({ searchString }) => {
  const classes = useStyles();
  const history = useHistory();

  const {
    loading, error, data,
  } = useQuery(GET_CASES);

  const [deleteCase] = useMutation(DELETE_CASE);

  const updateCache = (id) => (client) => {
    const clientData = client.readQuery({
      query: GET_CASES,
    });

    const newData = produce(clientData, (draftState) => {
      const idx = draftState.cases.edges
        .findIndex(({ node }) => node.id === id);
      draftState.cases.edges.splice(idx, 1);
    });

    client.writeQuery({
      query: GET_CASES,
      data: newData,
    });
  };

  if (loading || error) {
    return <CircularProgress />;
  }

  const cases = data.cases.edges
    .map((edge) => edge.node)
    .filter(({ name }) => searchString === null || name.toLowerCase().includes(searchString));

  const getQueryString = (object) => Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join('&');

  return (
    <>
      <Grid container spacing={3}>
        {cases.map((case_) => (
          <Grid key={case_.id}>
            <InventoryCard
              data={Object.entries(case_)
                .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
                .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
              title={case_.name}
              onClickEdit={() => history.push(`/cases/edit?${getQueryString(case_)}`)}
              onClickDelete={() => deleteCase({
                variables: { id: case_.id },
                update: updateCache(case_.id),
              })}
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
        path="/cases/edit"
        component={UpsertCaseDialog}
      />
    </>
  );
};

export default CasesDashboard;

CasesDashboard.propTypes = {
  searchString: PropTypes.string,
};

CasesDashboard.defaultProps = {
  searchString: null,
};
