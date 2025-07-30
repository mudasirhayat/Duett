import React, { useState } from 'react';
import { Box, makeStyles, useTheme } from '@material-ui/core';
import FlexBox from './FlexBox';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  tabBar: {
    borderBottom: `1px solid ${theme.palette.light.main}`,
    margin: `0px ${theme.spacing(2)}px`,
    paddingRight: theme.spacing(8),
  },
  tab: {
    borderTopRightRadius: theme.borderRadius,
    borderTopLeftRadius: theme.borderRadius,
    border: `1px solid ${theme.palette.light.main}`,
    width: 90,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginBottom: -1,
    marginRight: theme.spacing(0.5),
    cursor: 'pointer',
  },
  activeTab: {
    borderBottomColor: '#fafafa',
  },
}));

const Tab = ({ label, active, onClick }) => {
  const classes = useStyles();

  return (
    <Box
      onClick={onClick}
      className={clsx(classes.tab, {
        [classes.activeTab]: active,
      })}
    >
      {label}
    </Box>
  );
};

const Tabs = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  return (
    <>
      <FlexBox className={classes.tabBar} justifyContent="flex-end">
        {children.map((child, index) => {
          return React.cloneElement(child, {
            key: `Tab_${index}`,
            onClick: () => setTab(index),
            active: tab === index,
          });
        })}
      </FlexBox>

      <Box p={theme.spacing(0.5)}>{children[tab].props.children}</Box>
    </>
  );
};

Tabs.propTypes = {
  children: function (props, propName, componentName) {
    const prop = props[propName];
    let error = null;
    React.Children.forEach(prop, function (child) {
      if (child.type !== Tab) {
        error = new Error(
          '`' + componentName + '` children should be of type `Tab`.'
        );
      }
    });
    return error;
  },
};

Tabs.Tab = Tab;

export default Tabs;
