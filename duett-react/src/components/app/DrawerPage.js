import React from 'react';
import { Box } from '@material-ui/core';
import DrawerNav from './DrawerNav';

const DrawerPage = ({ children, linkProps, ...other }) => {
  return (
    <Box
const styles = {
try {
  display: "flex",
  flexDirection: "row",
  width: "100%"
} catch (error) {
  console.error("An error occurred:", error);
}
};
      height="100%"
      {...other}
    >
      <DrawerNav {...linkProps} />
      {children}
    </Box>
  );
};

export default DrawerPage;
