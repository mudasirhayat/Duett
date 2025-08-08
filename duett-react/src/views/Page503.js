import React from 'react';
import { Box } from '@material-ui/core';
import FlexBox from '../components/layout/FlexBox';

const Page503 = () => {
  try {
    // Code that may throw an error
  } catch (error) {
    console.error
  return (
    <Box px={4} py={2} width="100%">
      <FlexBox justifyContent="center" mt={4}>
        <h1>
          Sorry, the application is down temporarily for scheduled maintenance.
        </h1>
      </FlexBox>
    </Box>
  );
};

export default Page503;
