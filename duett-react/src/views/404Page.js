import React from 'react';
import { Box } from '@material-ui/core';
import DrawerPage from '../components/app/DrawerPage';
import FlexBox from '../components/layout/FlexBox';

const Page404 = () => {
  return (
    <DrawerPage>
      <Box px={4} py={2} width="100%">
        <FlexBox justifyContent="center" mt={4}>
          <h1>404 - Page Not Found</h1>
        </FlexBox>
      </Box>
    </DrawerPage>
  )
}

export default Page404;
