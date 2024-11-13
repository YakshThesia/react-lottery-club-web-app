import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import UserDetails from "../Screens/UserDetails/UserDetails";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function HomeScreenTab({ userId }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
          backgroundColor: "#EBA834",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Tab
            label="My Account"
            {...a11yProps(0)}
            sx={{
              color: "white",
              "&.Mui-selected": {
                color: "white", // Color for the selected tab
              },
            }}
          />
          <Tab
            label="Play & Win"
            {...a11yProps(1)}
            sx={{
              color: "white",
              "&.Mui-selected": {
                color: "white", // Color for the selected tab
              },
            }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserDetails userId={userId} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Play & Win
      </CustomTabPanel>
    </Box>
  );
}
