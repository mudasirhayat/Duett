import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import CareDetails from './CareDetails';

const RequestDetailsTab = ({ request }) => {
  return (
    <>
      <Typography variant={'body2'} gutterBottom>
        Care Details
      </Typography>

      <CareDetails request={request} />
    </>
  );
};

RequestDetailsTab.propTypes = {
  request: PropTypes.object,
};

export default RequestDetailsTab;
